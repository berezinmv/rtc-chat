import {UserInfo} from "../../server/users/user";

export enum MessageType {
  Text, File
}

export interface Message {
  text: string;
  user: UserInfo;
  type: MessageType;
  file?: {
    data: string;
    name: string;
  };
}
