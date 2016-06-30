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
    const userId: string = socket.id;

    socket.on("enter", (messageString: string) => {
      const message: {name: string} = JSON.parse(messageString);
      const userName = message.name;
      if (userName == null && userName === "") {
        return;
      }
      const user: User = new User(userId, userName);
      UserStorage.addUser(user);
      const userString = JSON.stringify(user);
      socket.emit("user", userString);
      socket.broadcast.emit("join", userString)
    });

    socket.on("webrtc", (messageString: string) => {
      const message: any = JSON.parse(messageString);
      console.log("webrtc", message.type, message.user, message.receiver, message.data);
      const receiver: any = message.receiver;
      const receiverId: string = receiver.id;
      if (receiverId != null) {
        if (UserStorage.getUser(receiverId)) {
          socket.broadcast.to(receiverId).emit("webrtc", messageString);
        }
      } else {
        socket.broadcast.emit("webrtc", messageString);
      }
    });

    socket.on("disconnect", () => {
      UserStorage.removeUser(userId);
      socket.broadcast.emit("leave", userId);
    });
  });
}
