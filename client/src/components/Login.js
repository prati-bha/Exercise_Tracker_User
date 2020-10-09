import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import validator from "validator";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      error: false,
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

  onSubmit(e) {
    const { history } = this.props;
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    localStorage.setItem("token", "1234");
    //TODO add endpoint for login
    // axios.post(`${ENDPOINTS.EXERCISES}/${id}`).then((response) => {
    //   localStorage.setItem("token", response.data.token);
    // });
  }

  render() {
    return (
      <div className="user-container">
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
        </form>
      </div>
    );
  }
}

export default Login;
