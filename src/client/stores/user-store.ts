import {User} from "../../server/users/user";
import {Subscription} from "./subscription";
import {WsService} from "../services/ws-service";

class UserStoreImpl {
  private user: User = null;
  private subscribers: Array<(u: User) => void> = [];

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
      .forEach((subscriber: (user: User) => void) => {
        subscriber(this.user);
      });
  }

  subscribe(callback: (u: User) => void): Subscription {
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
