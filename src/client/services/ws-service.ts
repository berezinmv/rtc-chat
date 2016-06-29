import * as socket from "socket.io-client";
import Socket = SocketIOClient.Socket;

export class WsService {
  private static wsUrl = window.location.href;
  private static client = null;

  static getClient(): Socket {
    if (!this.client) {
      this.client = socket(this.wsUrl);
    }
    return this.client;
  }
}
