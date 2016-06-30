import {WsService} from "./ws-service";
import {UserStore} from "../stores/user-store";

export class PeerService {
  private static sendMessage(type: string, data: any, user: any) {
    WsService.getClient().emit("webrtc", JSON.stringify({
      user: UserStore.getInstance().getUser(),
      receiver: user,
      data: data,
      type: type
    }));
  }

  static sendCandidateMessage(candidate: RTCIceCandidate, user: any) {
    PeerService.sendMessage("candidate", candidate, user);
  }

  static sendOfferMessage(description: RTCSessionDescription, user: any) {
    PeerService.sendMessage("offer", description, user);
  }

  static sendAnswerMessage(description: RTCSessionDescription, user: any) {
    PeerService.sendMessage("answer", description, user);
  }
}
