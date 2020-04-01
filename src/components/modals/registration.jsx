/** @format */

import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import FormHelper from "../common/formHelper";
import { saveUser } from "../../services/userService";

class Registration extends FormHelper {
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

  handleSave = async () => {
    try {
      await saveUser(this.state.data);
      this.props.onHide();
      this.props.onSubmit();
      toast.success("User added successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <Modal.Body>
          <Form>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}
            {this.renderCheck("isAdmin", "Make this user as Admin")}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {this.renderModalButton("Save", this.handleSave, "primary", true)}
          {this.renderModalButton("Close", this.props.onHide, "secondary")}
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

export default Registration;
