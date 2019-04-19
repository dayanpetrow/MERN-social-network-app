import React, { Component } from "react";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions";

//const SubMenu = Menu.SubMenu;
//const MenuItemGroup = Menu.ItemGroup;

class Navbar extends Component {
  state = {
    current: "mail"
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  handleLogoutClick = e => {
    this.props.logoutUser();
  };

  renderGuestLinks = (
    <React.Fragment>
      
    </React.Fragment>
  );

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Menu.Item key="logout">
        <Icon type="appstore" />
        <a href="#" onClick={this.handleLogoutClick}>
          Logout
        </a>
      </Menu.Item>
    );

    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="mail">
          <Icon type="mail" />
          <Link to="/">Home</Link>
        </Menu.Item>
        {isAuthenticated && authLinks}
        {!isAuthenticated && (
          <Menu.Item key="login">
          <Icon type="mail" />
          <Link to="/login">Login</Link>
        </Menu.Item>
        )}
        {!isAuthenticated && (
          <Menu.Item key="app">
            <Icon type="appstore" />
            <Link to="/signup">Sign up</Link>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch({ type: actions.LOGOUT_USER })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
