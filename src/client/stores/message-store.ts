import {Message} from "./message";
import {AbstractStore} from "./abstract-store";

class MessageStoreImpl extends AbstractStore<Array<Message>> {
  private messages: Array<Message> = [];

  protected getData(): Array<Message> {
    return this.messages;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.updateSubscribers();
  }
}

export const MessageStore = new MessageStoreImpl();
