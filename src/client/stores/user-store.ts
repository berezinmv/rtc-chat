import {User} from "../../server/users/user";
import {WsService} from "../services/ws-service";
import {AbstractStore} from "./abstract-store";

class UserStoreImpl extends AbstractStore<User> {
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
}

export const UserStore = new UserStoreImpl();
