import * as React from "react";
import {Component} from "react";
import {AuthService} from "../services/auth-service";

interface LoginProps {
}
interface LoginState {
}

export class Login extends Component<LoginProps, LoginState> {
  private getInputField(): HTMLInputElement {
    return this.refs["name-input"] as HTMLInputElement;
  }

  private getInputValue(): string {
    return this.getInputField().value;
  }

  private handleSubmit() {
    const value: string = this.getInputValue();
    if (value === "") {
      return;
    }
    AuthService.login(value);
  }

  render() {
    return (
      <div>
        <h2>Enter name</h2>
        <input type="text" ref="name-input"/>
        <button onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>
    );
  }
}
