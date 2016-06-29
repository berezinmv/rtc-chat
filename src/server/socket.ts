import {Server} from "http";
import * as socket from "socket.io";

/**
 * Configure web sockets
 * @param server - Http server
 */
export function configureSocket(server: Server): void {
  const io = socket(server);
}
