export class User {
  static fromObject(userObject: {id: string, name: string}) {
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
}
