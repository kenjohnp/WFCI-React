/** @format */

import React from "react";
import { Form, Card } from "react-bootstrap";
import Joi from "joi-browser";
import auth from "../services/authService";
import FormHelper from "./common/formHelper";

class Login extends FormHelper {
  state = { data: { username: "", password: "" }, errors: {} };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <Card className="w-25 mx-auto" style={{ marginTop: 200 }}>
          <Card.Header className="text-center">
            <strong>WFCI Login</strong>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Login")}
            </Form>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default Login;
