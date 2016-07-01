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

  addCandidate(candidate: RTCIceCandidate) {
    this.candidates.push(candidate);
  }

  getCandidates(): Array<RTCIceCandidate> {
    return this.candidates;
  }

  /**
   * Send string message
   * @param message - Message text
   */
  send(message: string) {
      this.channel.send(JSON.stringify({type: "string", data: message}));
  }

  /**
   * Send file message
   * @param dataUrl - File's dataUrl
   * @param fileName - File's name
   */
  sendFile(dataUrl: string, fileName: string) {
    const chunkLength = 1000;
    const onReadAsDataUrl = (text: string) => {
      var data: any = {fileName: fileName};

      if (text.length > chunkLength) {
        data.message = text.slice(0, chunkLength);
      } else {
        data.message = text;
        data.last = true;
      }
      this.channel.send(JSON.stringify({type: "file", data: data})); // use JSON.stringify for chrome!

      var remainingDataURL = text.slice(data.message.length);
      if (remainingDataURL.length) setTimeout(() => {
        onReadAsDataUrl(remainingDataURL); // continue transmitting
      }, 500);
    };
    onReadAsDataUrl(dataUrl);
  }

  close() {
    this.channel && this.channel.close();
    this.channel && this.channel.close();
  }
}
