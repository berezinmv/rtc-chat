import {WsService} from "./ws-service";

export class AuthService {
  static login(userName: string) {
    WsService.getClient()
      .emit("enter", JSON.stringify({name: userName}));
  }
}

