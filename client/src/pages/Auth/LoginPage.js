import React, { Component } from "react";
import Input from "antd/lib/input";
import Button from "antd/lib/button";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    return (
      <div>
        <Input
          placeholder="Email"
          name="email"
          value={this.state.email}
          onChange={this.onChange}
        />
        <Input
          placeholder="Password"
          name="password"
          value={this.state.password}
          onChange={this.onChange}
        />
        <Button type="primary" block onClick={this.onSubmit}>
          Login
        </Button>
      </div>
    );
  }
}
