export interface UserInfo {
  id: string;
  name: string;
}

export class User {
  static fromObject(userObject: UserInfo) {
    return new User(userObject.id, userObject.name);
  }

  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Get UserInfo object
   * @returns {UserInfo}
   */
  toUserInfo(): UserInfo {
    return {id: this.id, name: this.name};
  }
}
