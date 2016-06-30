import {Message} from "./message";
import {AbstractStore} from "./abstract-store";
import {UserStore} from "./user-store";
import {PeerStore} from "./peer-store";
import {Peer} from "../peers/peer";

export class MessageStore extends AbstractStore<Array<Message>> {
  private static instance: MessageStore = null;

  static getInstance(): MessageStore {
    if (!this.instance) {
      this.instance = new MessageStore();
    }
    return this.instance;
  }

  private userStore = UserStore.getInstance();
  private peerStore = PeerStore.getInstance();
  private messages: Array<Message> = [];

  protected getData(): Array<Message> {
    return this.messages;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.updateSubscribers();
  }

  sendMessage(message: string) {
    this.addMessage({
      text: message,
      user: this.userStore.getUser()
    });
    this.peerStore.getPeers()
      .forEach((peer: Peer) => peer.sendString(message));
  }
}
