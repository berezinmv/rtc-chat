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

  private handleSubmit(event: Event) {
    event.preventDefault();
    const value: string = this.getInputValue();
    if (value === "") {
      return;
    }
    AuthService.login(value);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" ref="name-input" className="form-control"/>
              </div>
              <button className="btn btn-success btn-block"
                      onClick={this.handleSubmit.bind(this)}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
