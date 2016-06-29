import {MessageStore} from "./message-store";

export class Peer {
  private connection: RTCPeerConnection;
  private channel: RTCDataChannel;

  constructor(connection: RTCPeerConnection) {
    this.connection = connection;
    this.channel = connection.createDataChannel();
    this.channel.onmessage = (messageEvent: RTCMessageEvent) => {
      MessageStore.addMessage({text: messageEvent.data});
    }
  }

  getConnection(): RTCPeerConnection {
    return this.connection;
  }

  getChannel(): RTCDataChannel {
    return this.channel;
  }

  sendString(message: string) {
    this.channel.send(message);
  }
}
