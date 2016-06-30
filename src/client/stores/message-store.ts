import {Message} from "./message";
import {AbstractStore} from "./abstract-store";

export class MessageStore extends AbstractStore<Array<Message>> {
  private static instance: MessageStore = null;

  static getInstance(): MessageStore {
    if (!this.instance) {
      this.instance = new MessageStore();
    }
    return this.instance;
  }


  private messages: Array<Message> = [];

  protected getData(): Array<Message> {
    return this.messages;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.updateSubscribers();
  }
}
