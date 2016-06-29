import * as React from "react";
import {Component} from "react";
import {Message} from "../stores/message";
import {MessageStore} from "../stores/message-store";
import {Subscription} from "../stores/subscription";

interface ChatProps {
}
interface ChatState {
  messages: Array<Message>;
}

export class Chat extends Component<ChatProps, ChatState> {
  private messageStoreSubscription: Subscription = null;

  constructor(props: ChatProps) {
    super(props);
    this.state = {messages: []};
  }

  componentDidMount() {
    this.messageStoreSubscription = MessageStore.subscribe(this.setMessages.bind(this));
  }

  componentWillUnmount() {
    this.messageStoreSubscription && this.messageStoreSubscription.unsubscribe();
  }

  private setMessages(messages: Array<Message>) {
    this.setState({messages: messages});
  }

  private getMessages(): Array<Message> {
    return this.state.messages;
  }

  render() {
    return (
      <div>
        <h2>Chat</h2>
        {this.getMessages().map((message: Message, index: number) =>
          <p key={index}>{message.text}</p>)}
      </div>
    );
  }
}
