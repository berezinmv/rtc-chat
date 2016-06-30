import {User} from "../../server/users/user";

export class Peer extends User {
  private connection: RTCPeerConnection;
  private channel: RTCDataChannel;
  private candidates: Array<RTCIceCandidate> = [];

  setConnection(connection: RTCPeerConnection) {
    this.connection = connection;
  }

  setChannel(channel: RTCDataChannel) {
    this.channel = channel;
  }

  getConnection(): RTCPeerConnection {
    return this.connection;
  }

  getChannel(): RTCDataChannel {
    return this.channel;
  }

  addCandidate(candidate: RTCIceCandidate) {
    this.candidates.push(candidate);
  }

  getCandidates(): Array<RTCIceCandidate> {
    return this.candidates;
  }

  sendString(message: string) {
    this.getChannel().send(message);
  }

  close() {
    this.getChannel().close();
    this.getConnection().close();
  }
}
