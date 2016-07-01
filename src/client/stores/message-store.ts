import {Message, MessageType} from "./message";
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

  /**
   * Send string message to all connected peers
   * @param message - Message text
   */
  sendMessage(message: string) {
    this.addMessage({
      text: message,
      user: this.userStore.getUser(),
      type: MessageType.Text
    });
    this.peerStore.getPeers()
      .forEach((peer: Peer) => peer.send(message));
  }

  /**
   * Send file to all connected peers
   * @param file - File object
   */
  sendFile(file: File) {
    const fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: Event) => {
      const result = (event.target as any).result;
      this.addMessage({
        text: file.name,
        user: this.userStore.getUser(),
        type: MessageType.File,
        file: {
          data: result,
          name: fileName
        }
      });
      this.peerStore.getPeers()
        .forEach((peer: Peer) => peer.sendFile(result, fileName));
    };
  }
}
