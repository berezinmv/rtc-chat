import {Peer} from "../peers/peer";
import {AbstractStore} from "./abstract-store";
import {WsService} from "../services/ws-service";
import {PeerFactory} from "../peers/peer-factory";
import {IceCandidate, SessionDescription} from "../utils";

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
        const peerInfo: {id: string, name: string} = JSON.parse(peerInfoString);
        this.addPeer(PeerFactory.createNew(peerInfo));
      })
      .on("leave", (peerId: string) => {
        const peer = this.removePeer(peerId);
        peer && peer.close();
      })
      .on("webrtc", (message: string) => {
        const {type, user, data} = JSON.parse(message);
        let peer;
        switch (type) {
          case "candidate":
            if (this.getPeer(user.id)) {
              return;
            }
            peer = PeerFactory.createRemote(user);
            peer.getConnection().addIceCandidate(new IceCandidate(data));
            this.addPeer(peer);
            break;
          case "offer":
            console.log("offer");
            peer = PeerFactory.createRemote(user);
            const connection = peer.getConnection();
            connection.setRemoteDescription(new SessionDescription(data));
            connection.createAnswer(connection.setLocalDescription, (err: DOMError) => console.error(err));
            this.addPeer(peer);
            break;
          case "answer":
            console.log("answer");
            this.getPeer(user).getConnection().setRemoteDescription(new SessionDescription(data));
            break;
        }
      });
  }

  protected getData(): Array<Peer> {
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
