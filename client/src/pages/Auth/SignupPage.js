import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { connect } from "react-redux";
import * as actions from "../../actions";

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.errors);
    if(nextProps.errors !== prevState.errors) {
      return ({ errors: nextProps.errors })
    }
    return null;
  }

  componentDidUpdate() {
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.signUpUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        {this.props.auth.user.name && (<div>{this.props.auth.user.name}</div>)}
        <Form.Item
          hasFeedback
          validateStatus={errors.name ? "error" : ""}
          help={errors.name || ""}
        >
          <Input
            placeholder="Name"
            name="name"
            value={this.state.name}
            onChange={this.onChange}
            size="large"
          />
        </Form.Item>

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

        <Form.Item
          hasFeedback
          validateStatus={errors.password2 ? "error" : ""}
          help={errors.password2 || ""}
        >
          <Input
            placeholder="Confirm password"
            name="password2"
            value={this.state.password2}
            onChange={this.onChange}
            size="large"
            type="password"
          />
        </Form.Item>

        <Button type="primary" block onClick={this.onSubmit} size="large">
          Submit
        </Button>
      </div>
    );
  }
}

SignupPage.propTypes = {
  signUpUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = dispatch => {
  return {
    signUpUser: (userData, history) => dispatch({ type: actions.SIGNUP_USER, userData, history })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SignupPage));
