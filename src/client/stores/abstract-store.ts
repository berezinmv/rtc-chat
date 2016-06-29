import {SubscriberCallback} from "./subscriber-callback";
import {Subscription} from "./subscription";

export abstract class AbstractStore<T> {
  private subscribers: Array<SubscriberCallback> = [];

  protected abstract getData(): T;

  protected updateSubscribers() {
    this.subscribers.forEach((cb: SubscriberCallback) => cb(this.getData()));
  }

  subscribe(callback: SubscriberCallback): Subscription {
    this.subscribers.push(callback);
    callback(this.getData());
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers
          .filter((cb: SubscriberCallback) => cb !== callback);
      }
    };
  }
}
