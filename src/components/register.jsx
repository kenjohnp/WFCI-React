/** @format */

import React from "react";
import Joi from "joi-browser";
import { Form, Col, Row } from "react-bootstrap";
import { saveUser } from "../services/userService";
import FormHelper from "./common/formHelper";

class Register extends FormHelper {
  state = { data: { username: "", password: "", isAdmin: false }, errors: {} };

  schema = {
    username: Joi.string()
      .min(5)
      .required()
      .label("Username"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password"),
    isAdmin: Joi.boolean()
  };

  doSubmit = async () => {
    try {
      await saveUser(this.state.data);
      window.location = "/users";
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
        <Col xl="2"></Col>
        <Col xl="8" md="12" className="p-5 w-75">
          <Row className="justify-content-center">
            <Form className="w-50" onSubmit={this.handleSubmit}>
              <h2>Register</h2>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderCheck("isAdmin", "Make this user as Admin")}
              {this.renderButton("Save")}
            </Form>
          </Row>
        </Col>
        <Col xl="2"></Col>
      </React.Fragment>
    );
  }
}

export default Register;
