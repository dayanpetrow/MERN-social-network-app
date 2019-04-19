import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import * as actions from "../../actions";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isAuthenticated) {
      nextProps.history.push("/dashboard");
    }
    if (nextProps.errors !== prevState.errors) {
      return { errors: nextProps.errors };
    }
    return null;
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.state;

    return (
      <div>
        <Form.Item
          hasFeedback
          validateStatus={errors.email ? "error" : ""}
          help={errors.email || ""}
        >
          <Input
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            size="large"
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          validateStatus={errors.password ? "error" : ""}
          help={errors.password || ""}
        >
          <Input
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            size="large"
            type="password"
          />
        </Form.Item>
        <Button type="primary" block onClick={this.onSubmit}>
          Login
        </Button>
      </div>
    );
  }
}

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: userData => dispatch({ type: actions.LOGIN_USER, userData })
  };
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
