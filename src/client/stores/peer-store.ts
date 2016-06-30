import {Peer} from "../peers/peer";
import {AbstractStore} from "./abstract-store";
import {WsService} from "../services/ws-service";
import {PeerFactory} from "../peers/peer-factory";
import {IceCandidate, SessionDescription} from "../utils";
import {UserInfo} from "../../server/users/user";

export class PeerStore extends AbstractStore<Array<Peer>> {
  private static instance: PeerStore = null;

  static getInstance(): PeerStore {
    if (!this.instance) {
      this.instance = new PeerStore();
    }
    return this.instance;
  }


  private peers: Array<Peer> = [];

  constructor() {
    super();
    WsService.getClient()
      .on("join", (peerInfoString: string) => {
        const peerInfo: UserInfo = JSON.parse(peerInfoString);
        const peer = PeerFactory.createNew(peerInfo);
        const connection = peer.getConnection();
        connection.createOffer().then((description: RTCSessionDescription) => {
          connection.setLocalDescription(description).then(() => {
            console.log("setLocal");
          }, (err: DOMError) => console.error(err));
        }, (err: DOMError) => console.error(err));
        this.addPeer(peer);
      })
      .on("leave", (peerId: string) => {
        const peer = this.removePeer(peerId);
        peer && peer.close();
      })
      .on("webrtc", (message: string) => {
        const {type, user, data} = JSON.parse(message);
        const userId = user.id;
        let peer;
        switch (type) {
          case "candidate":
            peer = PeerFactory.createRemote(user);
            peer.getConnection().addIceCandidate(new IceCandidate(data))
              .then(() => {
                console.log("addIceCandidate");
              }, (err: DOMError) => console.error(err));
            break;
          case "offer":
            peer = PeerFactory.createRemote(user);
            const connection = peer.getConnection();
            connection.setRemoteDescription(new SessionDescription(data)).then(() => {
              console.log("setRemote");
              connection.createAnswer().then((description: RTCSessionDescription) => {
                connection.setLocalDescription(description).then(() => {
                  console.log("setLocal");
                }, (err: DOMError) => console.error(err));
              }, (err: DOMError) => console.error(err));
            }, (err: DOMError) => console.error(err));
            break;
          case "answer":
            this.getPeer(userId).getConnection()
              .setRemoteDescription(new SessionDescription(data))
              .then(() => {
                console.log("setRemote");
              });
            break;
        }
      });
  }

  protected getData(): Array<Peer> {
    return this.getPeers();
  }

  getPeers(): Array<Peer> {
    return this.peers;
  }

  addPeer(peer: Peer) {
    this.peers.push(peer);
    this.updateSubscribers();
  }

  getPeer(peerId: string): Peer {
    return this.peers.filter((peer: Peer) => peer.getId() === peerId)[0];
  }

  removePeer(peerId: string): Peer {
    const peer = this.getPeer(peerId);
    this.peers = this.peers.filter((peer: Peer) => peer.getId() !== peerId);
    this.updateSubscribers();
    return peer;
  }
}

(window as any).peerStore = PeerStore.getInstance.bind(PeerStore);
