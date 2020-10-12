import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../App.css";
import { profile } from "../images";
import axios from "axios";
import { ENDPOINTS, getToken } from "../constant";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      setAnchorEl: "",
      anchorEl: false,
    };
  }

  handleClick = (event) => {
    this.setState({ setAnchorEl: event.currentTarget, anchorEl: true });
  };

  handleClose = () => {
    this.setState({ setAnchorEl: "", anchorEl: false });
  };

  handleLogout = () => {
    const { history } = this.props;
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    axios
      .get(`${ENDPOINTS.LOGOUT}`, { headers: getToken })
      .then((response) => history.push("/"));
  };

  render() {
    const username =
      localStorage.getItem("username") === null ? null : (
        <li className="navbar-item">
          <Link to="/user" className="nav-link">
            Create User
          </Link>
        </li>
      );
    const logout =
      localStorage.getItem("token") === null ? null : (
        <li className="navbar-item">
          <button className="btn btn-secondary" onClick={this.handleLogout}>
            Logout
          </button>
        </li>
      );
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/list" className="navbar-brand">
          ExcerTracker
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/list" className="nav-link">
                Exercises
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">
                Create Exercise Log
              </Link>
            </li>
            {username}
            {logout}
            {/* <li className="navbar-item">
              <Button
                className="nav-btn"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <img src={profile} alt="profile" className="nav-img"></img>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
              </Menu>
            </li> */}
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
