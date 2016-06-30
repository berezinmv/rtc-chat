import * as React from "react";
import {Component} from "react";
import {Chat} from "./chat";
import {Login} from "./login";
import {User} from "../../server/users/user";
import {UserStore} from "../stores/user-store";
import {Subscription} from "../stores/subscription";

export interface ApplicationProps {
}
export interface ApplicationState {
  user?: User;
}

export class Application extends Component<ApplicationProps, ApplicationState> {
  private userStore = UserStore.getInstance();
  private userStoreSubscription: Subscription = null;

  constructor(props: ApplicationProps) {
    super(props);
    this.state = {user: null};
  }

  componentDidMount() {
    this.userStoreSubscription = this.userStore.subscribe(this.setUser.bind(this));
  }

  componentWillUnmount() {
    this.userStoreSubscription && this.userStoreSubscription.unsubscribe();
  }

  private setUser(user: User) {
    this.setState({user: user});
  }

  private getUser() {
    return this.state.user;
  }

  private userExist(): boolean {
    return this.getUser() != null;
  }

  render() {
    if (this.userExist()) {
      return <Chat user={this.getUser()}/>;
    } else {
      return <Login/>
    }
  }
}
