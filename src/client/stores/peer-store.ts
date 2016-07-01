import {Peer} from "../peers/peer";
import {AbstractStore} from "./abstract-store";
import {WsService} from "../services/ws-service";
import {PeerFactory} from "../peers/peer-factory";
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
          }, (err: DOMError) => console.error(err));
        }, (err: DOMError) => console.error(err));
      })
      .on("leave", (peerId: string) => {
        const peer = this.removePeer(peerId);
        peer && peer.close();
      })
      .on("webrtc", (message: string) => {
        const {type, user, data} = JSON.parse(message);
        switch (type) {
          case "candidate":
            this.handleCandidate(data, user);
            break;
          case "offer":
            this.handleOffer(data, user);
            break;
          case "answer":
            this.handleAnswer(data, user);
            break;
        }
      });
  }

  /**
   * Handle candidate request
   * @param data - Request data
   * @param user - User info
   */
  protected handleCandidate(data: any, user: UserInfo) {
    const peer = PeerFactory.createRemote(user);
    peer.getConnection().addIceCandidate(new RTCIceCandidate(data))
      .then(() => {}, (err: DOMError) => console.error(err));
  }

  /**
   * Handle offer request
   * @param data - Request data
   * @param user - User info
   */
  protected handleOffer(data: any, user: UserInfo) {
    const peer = PeerFactory.createRemote(user);
    const connection = peer.getConnection();
    connection.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
      connection.createAnswer().then((description: RTCSessionDescription) => {
        connection.setLocalDescription(description).then(() => {
        }, (err: DOMError) => console.error(err));
      }, (err: DOMError) => console.error(err));
    }, (err: DOMError) => console.error(err));

  }

  /**
   * Handle answer request
   * @param data - Request data
   * @param user - User info
   */
  protected handleAnswer(data: any, user: UserInfo) {
    this.getPeer(user.id).getConnection()
      .setRemoteDescription(new RTCSessionDescription(data))
      .then(() => {});
  }

  protected getData(): Array<Peer> {
    return this.getPeers();
  }

  getPeers(): Array<Peer> {
    return this.peers;
  }

  getPeer(peerId: string): Peer {
    return this.peers.filter((peer: Peer) => peer.getId() === peerId)[0];
  }

  addPeer(peer: Peer) {
    this.peers.push(peer);
    this.updateSubscribers();
  }

  removePeer(peerId: string): Peer {
    const peer = this.getPeer(peerId);
    this.peers = this.peers.filter((peer: Peer) => peer.getId() !== peerId);
    this.updateSubscribers();
    return peer;
  }
}

(window as any).peerStore = PeerStore.getInstance.bind(PeerStore);
