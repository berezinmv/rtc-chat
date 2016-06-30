import {UserInfo} from "../../server/users/user";

export interface Message {
  text: string;
  user: UserInfo;
}
