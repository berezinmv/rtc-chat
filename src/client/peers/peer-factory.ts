import {Peer} from "./peer";
import {MessageStore} from "../stores/message-store";
import {PeerService} from "../services/peer-service";
import {UserInfo} from "../../server/users/user";
import {PeerStore} from "../stores/peer-store";
import {MessageType} from "../stores/message";

const server = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

const options = {
  optional: [
    {
      DtlsSrtpKeyAgreement: true
    }
  ]
};

export class PeerFactory {
  /**
   * Create new peer object
   * @param info - User info
   * @returns {Peer}
   */
  static createNew(info: UserInfo): Peer {
    const peer = new Peer(info.id, info.name);
    PeerStore.getInstance().addPeer(peer);
    const connection = this.prepareConnection(peer, "offer");
    peer.setConnection(connection);
    const channel = connection.createDataChannel("data", {});
    this.bindChannelEvents(channel, peer);
    peer.setChannel(channel);
    return peer;
  }

  /**
   * Create peer object to respond offer request
   * @param info
   * @returns {Peer}
   */
  static createRemote(info: UserInfo): Peer {
    const peerStore = PeerStore.getInstance();
    let peer = peerStore.getPeer(info.id);
    if (peer) {
      return peer;
    }
    peer = new Peer(info.id, info.name);
    peerStore.addPeer(peer);
    const connection = this.prepareConnection(peer, "answer");
    peer.setConnection(connection);
    connection.ondatachannel = (event: RTCDataChannelEvent) => {
      const channel = event.channel;
      this.bindChannelEvents(channel, peer);
      peer.setChannel(channel);
    };
    return peer;
  }

  /**
   * Prepare RTCPeerConnection object
   * @param peer - Peer
   * @param type - SDP type
   * @returns {RTCPeerConnection}
   */
  private static prepareConnection(peer: Peer, type: string): RTCPeerConnection {
    const connection = new RTCPeerConnection(server, options);
    connection.onicecandidate = (event: RTCIceCandidateEvent) => {
      const candidate = event.candidate;
      if (candidate) {
        peer.addCandidate(candidate);
      } else {
        PeerService.sendMessage(type, connection.localDescription, peer);
        peer.getCandidates().forEach((candidate: RTCIceCandidate) => {
          PeerService.sendMessage("candidate", candidate, peer);
        });
      }
    };
    return connection;
  }

  private static bindChannelEvents(channel: RTCDataChannel, peer: Peer) {
    const messageStore = MessageStore.getInstance();
    const userInfo = peer.toUserInfo();
    let chunks: Array<string> = [];
    channel.onmessage = (messageEvent: RTCMessageEvent) => {
      const dataObject = JSON.parse(messageEvent.data);
      const type = dataObject.type;
      const data = dataObject.data;
      switch (type) {
        case "string":
          messageStore.addMessage({
            text: data,
            user: userInfo,
            type: MessageType.Text
          });
          break;
        case "file":
          const fileName = data.fileName;
          chunks.push(data.message); // pushing chunks in array

          if (data.last) {
            messageStore.addMessage({
              text: fileName,
              user: userInfo,
              type: MessageType.File,
              file: {
                data: chunks.join(""),
                name: fileName
              }
            });
            chunks = []; // resetting array
          }
          break;
      }
    };
  }
}
