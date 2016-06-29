import {User} from "../../server/users/user";
import {Subscription} from "./subscription";
import {WsService} from "../services/ws-service";
import {SubscriberCallback} from "./subscriber-callback";

class UserStoreImpl {
  private user: User = null;
  private subscribers: Array<SubscriberCallback> = [];

  constructor() {
    WsService.getClient()
      .on("user", (userString: string) => {
        this.setUser(User.fromObject(JSON.parse(userString)));
      });
  }

  private setUser(user: User) {
    this.user = user;
    this.updateSubscribers();
  }

  private updateSubscribers() {
    this.subscribers
      .forEach((cb: SubscriberCallback) => cb(this.user));
  }

  subscribe(callback: SubscriberCallback): Subscription {
    this.subscribers.push(callback);
    callback(this.user);
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers
          .filter((cb) => cb !== callback);
      }
    };
  }
}

export const UserStore = new UserStoreImpl();
