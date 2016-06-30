import {WsService} from "./ws-service";
import {UserStore} from "../stores/user-store";
import {Peer} from "../peers/peer";

export class PeerService {
  static sendMessage(type: string, data: any, peer: Peer) {
    WsService.getClient().emit("webrtc", JSON.stringify({
      user: UserStore.getInstance().getUser().toUserInfo(),
      receiver: peer.toUserInfo(),
      data: data,
      type: type
    }));
  }
}
