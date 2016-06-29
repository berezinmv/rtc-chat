import {Peer} from "./peer";
import {AbstractStore} from "./abstract-store";

class PeerStoreImpl extends AbstractStore<Array<Peer>> {
  private peers: Array<Peer> = [];

  protected getData(): Array<Peer> {
    return this.peers;
  }
}

export const PeerStore = new PeerStoreImpl();
