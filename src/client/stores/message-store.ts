import {Message} from "./message";
import {Subscription} from "./subscription";
import {SubscriberCallback} from "./subscriber-callback";

class MessageStoreImpl {
  private messages: Array<Message> = [];
  private subscribers: Array<SubscriberCallback> = [];

  private updateSubscribers() {
    this.subscribers
      .forEach((cb: SubscriberCallback) => cb(this.messages));
  }

  subscribe(callback: SubscriberCallback): Subscription {
    this.subscribers.push(callback);
    callback(this.messages);
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers
          .filter((cb: SubscriberCallback) => cb !== callback);
      }
    };
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.updateSubscribers();
  }
}

export const MessageStore = new MessageStoreImpl();
