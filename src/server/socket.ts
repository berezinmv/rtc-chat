import {Server} from "http";
import * as socket from "socket.io";
import Socket = SocketIO.Socket;
import Client = SocketIO.Client;
import {User} from "./users/user";
import {UserStorage} from "./users/user-storage";

/**
 * Configure web sockets
 * @param server - Http server
 */
export function configureSocket(server: Server): void {
  const io = socket(server);

  io.on("connection", (socket: Socket) => {
    const client: Client = socket.client;
    const clientId: string = client.id;

    socket.on("enter", (message: string) => {
      const parsedMessage: {name: string} = JSON.parse(message);
      const userName = parsedMessage.name;
      if (userName == null && userName === "") {
        return;
      }
      const user: User = new User(clientId, userName);
      UserStorage.addUser(user);
    });

    socket.on("disconnect", () => {
      UserStorage.removeUser(clientId);
    });
  });
}
