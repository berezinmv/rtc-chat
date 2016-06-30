import {PeerConnection} from "../utils";
import {Peer} from "./peer";
import {MessageStore} from "../stores/message-store";
import {PeerService} from "../services/peer-service";
import {UserInfo} from "../../server/users/user";
import {PeerStore} from "../stores/peer-store";

const server = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302"
    }
  ]
};

const options = {
  optional: [
    // {
    //   DtlsSrtpKeyAgreement: true
    // },
    // {
    //   RtpDataChannels: true
    // }
  ]
};

export class PeerFactory {
  static createNew(info: UserInfo): Peer {
    const peer = new Peer(info.id, info.name);
    const connection = this.prepareConnection(peer, "offer");
    peer.setConnection(connection);
    const channel = connection.createDataChannel("data", {});
    this.bindChannelEvents(channel, peer);
    peer.setChannel(channel);
    return peer;
  }

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
      console.log("ondatachannel");
      const channel = event.channel;
      this.bindChannelEvents(channel, peer);
      peer.setChannel(channel);
    };
    return peer;
  }

  private static prepareConnection(peer: Peer, type: string): RTCPeerConnection {
    const connection = new PeerConnection(server, options);
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
    channel.onmessage = (messageEvent: RTCMessageEvent) => {
      MessageStore.getInstance().addMessage({text: messageEvent.data, user: peer.toUserInfo()});
    };
  }
}
