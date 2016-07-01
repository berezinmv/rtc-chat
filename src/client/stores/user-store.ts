import {User} from "../../server/users/user";
import {WsService} from "../services/ws-service";
import {AbstractStore} from "./abstract-store";

export class UserStore extends AbstractStore<User> {
  private static instance: UserStore = null;

  static getInstance(): UserStore {
    if (!this.instance) {
      this.instance = new UserStore();
    }
    return this.instance;
  }

  private user: User = null;

  constructor() {
    super();
    WsService.getClient()
      .on("user", (userString: string) => {
        this.setUser(User.fromObject(JSON.parse(userString)));
      });
  }

  protected getData(): User {
    return this.user;
  }

  private setUser(user: User) {
    this.user = user;
    this.updateSubscribers();
  }

  getUser(): User {
    return this.user;
  }
}
