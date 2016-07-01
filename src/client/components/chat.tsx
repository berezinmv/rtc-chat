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
  private messageStore = MessageStore.getInstance();
  private peerStore = PeerStore.getInstance();
  private messageStoreSubscription: Subscription = null;
  private peerStoreSubscription: Subscription = null;

  constructor(props: ChatProps) {
    super(props);
    this.state = {messages: [], users: []};
  }

  componentDidMount() {
    this.messageStoreSubscription = this.messageStore.subscribe(this.setMessages.bind(this));
    this.peerStoreSubscription = this.peerStore.subscribe(this.setUsers.bind(this));
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

  private getMessageInput(): HTMLTextAreaElement {
    return this.refs["message-input"] as HTMLTextAreaElement;
  }

  private getInputValue(): string {
    return this.getMessageInput().value;
  }

  private setInputValue(value: string) {
    this.getMessageInput().value = value;
  }


  /**
   * Handle textarea key down event
   * @param event
   */
  private keyDown(event: KeyboardEvent) {
    const key = event.keyCode;
    if (key === 13) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Handle message click event
   * @param message - Message object
   */
  private onMessageClick(message: Message) {
    const file = message.file;
    if (file) {
      const fileName = file.name;
      var fileDataURL = file.data; // it is Data URL...can be saved to disk
      var save: HTMLAnchorElement = document.createElement('a');
      save.href = fileDataURL;
      save.target = '_blank';
      (save as any).download = fileName || fileDataURL;

      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);

      save.dispatchEvent(evt);

      (window.URL || (window as any).webkitURL).revokeObjectURL(save.href);
    }
  }

  private sendMessage() {
    const text = this.getInputValue();
    if (text === "") {
      return;
    }
    this.messageStore.sendMessage(text);
    this.setInputValue("");
  }

  private sendFile(event: Event) {
    const target = (event.target) as HTMLInputElement;
    const file = target.files[0];
    if (file) {
      this.messageStore.sendFile(file);
    }
    target.value = "";
  }

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3">
              <div className="panel panel-default" style={{height: "400px"}}>
                <div className="panel-heading">
                  <h3>Users</h3>
                </div>
                <div className="panel-body">
                  {this.getUsers().map((user: User, index: number) =>
                    <p key={index}>{user.getName()}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xs-9">
              <div className="panel panel-default" style={{height: "400px"}}>
                <div className="panel-heading">
                  <h3>Messages</h3>
                </div>
                <div className="panel-body">
                  {this.getMessages().map((message: Message, index: number) => {
                    return (
                      <p style={message.file != null ? {
                        color: "lightblue",
                        fontWeight: "bold",
                        textDecoration: "underline",
                        cursor: "pointer"} : {}}
                         key={index} onClick={this.onMessageClick.bind(this, message)}>
                        {message.user.name}: {message.text}
                      </p>
                    );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="panel panel-default">
                <div className="panel-body">
                  <textarea style={{width: "100%", resize: "none"}} ref="message-input"
                            onKeyDown={this.keyDown.bind(this)}/>
                  <div>
                    <button style={{display: "inline", marginRight: "10px"}} onClick={this.sendMessage.bind(this)}
                            className="btn btn-primary">
                      Send message
                    </button>
                    <input style={{display: "inline"}} type="file"
                           onChange={this.sendFile.bind(this)} className="btn btn-primary"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
