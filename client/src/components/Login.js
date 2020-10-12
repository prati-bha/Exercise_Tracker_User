import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import validator from "validator";
import axios from "axios";
import { ENDPOINTS } from "../constant";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import * as actionTypes from "../store/actions";
import { connect } from "react-redux";
import Spinner from "./Spinner/Spinner";

toast.configure();

export class Login extends Component {
  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      error: false,
      token: "",
      username: "",
      loading: false,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: "",
      errorMessage: "",
      error: false,
    });
    if (e.target.value && !validator.isEmail(e.target.value)) {
      this.setState({
        errorMessage: "Invalid Email",
        error: true,
      });
    }
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  notify(e) {
    return toast.success(e, { position: toast.POSITION.TOP_RIGHT });
  }

  onSubmit(e) {
    this.setState({
      loading: true,
    });
    const { history } = this.props;
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    // TODO add endpoint for login
    axios
      .post(`${ENDPOINTS.LOGIN}`, user)
      .then((response) => {
        this.setState(
          {
            loading: false,
            token: response.data.token,
            username: response.data.user.username,
          },
          () => {
            localStorage.setItem("token", response.data.token);
            if (response.data.user.username) {
              localStorage.setItem("username", response.data.user.username);
              this.notify("Logged In Successfully!");
            } else {
              history.push("/user");
            }
          }
        );
        // setTimeout(() => {
        history.push("/list");
        // }, 5000);
        this.props.dispatchSubmit({
          token: this.state.token,
          username: this.state.username,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        return this.notify(err);
      });
  }

  handleSignUp() {
    const { history } = this.props;
    history.push("/signUp");
  }
  render() {
    return (
      <div className="exercise-container">
        <h3>Login</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <TextField
              variant="outlined"
              error={this.state.errorMessage.length}
              helperText={this.state.errorMessage}
              required
              id="standard-required"
              label="Email"
              placeholder="Enter Email"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <TextField
              variant="outlined"
              required
              id="standard-required"
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Login"
              className="btn btn-primary"
              disabled={
                !this.state.email || !this.state.password || this.state.error
              }
            />
          </div>
          <div className="form-group">
            <a>New to ExcerTracker?</a>
            <br></br>
            <button className="btn btn-warning" onClick={this.handleSignUp}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     token: state.token,
//     username: state.username,
//   };
// };

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSubmit: (payload) =>
      dispatch({ type: actionTypes.LOGIN, payload: payload }),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(Login));
