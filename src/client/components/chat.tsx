import * as React from "react";
import {Component} from "react";
import {Message} from "../stores/message";
import {MessageStore} from "../stores/message-store";
import {Subscription} from "../stores/subscription";
import {PeerStore} from "../stores/peer-store";
import {User} from "../../server/users/user";

interface ChatProps {
  user: User;
}
interface ChatState {
  messages?: Array<Message>;
  users?: Array<User>;
}

export class Chat extends Component<ChatProps, ChatState> {
  private messageStoreSubscription: Subscription = null;
  private peerStoreSubscription: Subscription = null;

  constructor(props: ChatProps) {
    super(props);
    this.state = {messages: [], users: []};
  }

  componentDidMount() {
    this.messageStoreSubscription = MessageStore.getInstance().subscribe(this.setMessages.bind(this));
    this.peerStoreSubscription = PeerStore.getInstance().subscribe(this.setUsers.bind(this));
  }

  componentWillUnmount() {
    this.messageStoreSubscription && this.messageStoreSubscription.unsubscribe();
    this.peerStoreSubscription && this.peerStoreSubscription.unsubscribe();
  }

  private setMessages(messages: Array<Message>) {
    this.setState({messages: messages});
  }

  private setUsers(users: Array<User>) {
    this.setState({users: users});
  }

  private getMessages(): Array<Message> {
    return this.state.messages;
  }

  private getUsers(): Array<User> {
    return [this.props.user].concat(this.state.users);
  }

  render() {
    return (
      <div>
        <h2>Chat</h2>
        <h3>Users</h3>
        {this.getUsers().map((user: User, index: number) =>
          <p key={index}>{user.getName()}</p>)}
        <h3>Messages</h3>
        {this.getMessages().map((message: Message, index: number) =>
          <p key={index}>{message.text}</p>)}
      </div>
    );
  }
}
