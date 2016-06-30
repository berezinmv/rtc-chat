import {PeerConnection} from "../utils";
import {Peer} from "./peer";
import {MessageStore} from "../stores/message-store";
import {PeerService} from "../services/peer-service";
import {UserInfo} from "../../server/users/user";

const server = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302"
    },
    {
      url: "stun:stun1.l.google.com:19302"
    },
    {
      url: "stun:stun2.l.google.com:19302"
    },
    {
      url: "stun:stun3.l.google.com:19302"
    },
    {
      url: "stun:stun4.l.google.com:19302"
    }
  ]
};

const options = {
  optional: [
    {
      DtlsSrtpKeyAgreement: true
    },
    {
      RtpDataChannels: true
    }
  ]
};

export class PeerFactory {
  static createNew(info: UserInfo): Peer {
    const peer = new Peer(info.id, info.name);
    const connection = this.prepareOfferConnection(peer, new PeerConnection(server, options));
    peer.setConnection(connection);
    const channel = connection.createDataChannel("data", {});
    this.bindChannelEvents(channel);
    peer.setChannel(channel);
    connection.createOffer((description: RTCSessionDescription) => {
      connection.setLocalDescription(description);
    }, (err: DOMError) => console.error(err));
    return peer;
  }

  static createRemote(info: UserInfo): Peer {
    const peer = new Peer(info.id, info.name);
    const connection = this.prepareAnswerConnection(peer, new PeerConnection(server, options));
    peer.setConnection(connection);
    connection.ondatachannel = (event: RTCDataChannelEvent) => {
      const channel = event.channel;
      this.bindChannelEvents(channel);
      peer.setChannel(channel);
    };
    return peer;
  }

  private static prepareConnection(peer: Peer, connection: RTCPeerConnection, sendMessage: Function): RTCPeerConnection {
    connection.onicecandidate = (event: RTCIceCandidateEvent) => {
      const candidate = event.candidate;
      if (candidate) {
        peer.addCandidate(candidate);
      } else {
        sendMessage(connection.localDescription, peer.toUserInfo());
        peer.getCandidates().forEach((candidate: RTCIceCandidate) =>
          PeerService.sendCandidateMessage(candidate, peer.toUserInfo()));
      }
    };
    return connection;
  }

  private static prepareOfferConnection(peer: Peer, connection: RTCPeerConnection): RTCPeerConnection {
    return this.prepareConnection(peer, connection, PeerService.sendOfferMessage);
  }

  private static prepareAnswerConnection(peer: Peer, connection: RTCPeerConnection): RTCPeerConnection {
    return this.prepareConnection(peer, connection, PeerService.sendAnswerMessage);
  }

  private static bindChannelEvents(channel: RTCDataChannel) {
    channel.onmessage = (messageEvent: RTCMessageEvent) => {
      MessageStore.getInstance().addMessage({text: messageEvent.data});
    };
  }
}
