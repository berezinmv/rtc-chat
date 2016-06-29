import {User} from "./user";

class UserStorageImpl {
  private users: Array<User> = [];

  /**
   * Add new user or replace existing if user with that id already exist
   * @param user -
   */
  addUser(user: User): void {
    this.users = this.users
      .filter((u: User) => u.getId() !== user.getId())
      .concat(user);
  }

  getUser(id: string): User {
    return this.users.filter((user: User) => user.getId() === id)[0];
  }

  removeUser(id: string): User {
    const user = this.getUser(id);
    this.users = this.users.filter((user: User) => user.getId() !== id);
    return user;
  }
}

export const UserStorage = new UserStorageImpl();
