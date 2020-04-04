/** @format */

import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";
import Joi from "joi-browser";
import _ from "lodash";
import { toast } from "react-toastify";
import FormHelper from "../common/formHelper";
import { saveUser, deleteUser } from "../../services/userService";

class Registration extends FormHelper {
  state = { data: { username: "", password: "", isAdmin: false }, errors: {} };

  schema = {
    username: Joi.string().min(5).required().label("Username"),
    password: Joi.string().min(5).required().label("Password"),
    isAdmin: Joi.boolean(),
  };

  resetModal = () => {
    const data = { username: "", password: "", isAdmin: false };
    const errors = {};
    this.setState({ data, errors });
  };

  handleEntering = () => {
    this.resetModal();
    const { selectedData, modalType } = this.props;
    if (!_.isEmpty(selectedData)) {
      const data = { ...selectedData, password: "" };
      this.setState({ data });
    }

    if (modalType === "resetPassword") {
      delete this.schema.username;
    } else if (modalType === "newUser") {
      this.schema.username = Joi.string().min(5).required().label("Username");
    }
  };

  handleSave = async (e) => {
    e.preventDefault();
    const { modalType, selectedData, onHide, onSubmit } = this.props;

    try {
      if (!_.isEmpty(selectedData)) {
        const data = this.state.data;
        data._id = selectedData._id;
        this.setState({ data });
      }
      switch (modalType) {
        case "newUser":
          await saveUser(this.state.data);
          toast.success("User registered successfully.");
          break;
        case "resetPassword":
          await saveUser(this.state.data);
          toast.success("Password resetted successfully.");
          break;
        default:
          break;
      }

      this.resetModal();
      onHide();
      onSubmit(selectedData);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    const { show, onHide, title, modalType } = this.props;

    return (
      <React.Fragment>
        <Modal
          show={show}
          onHide={onHide}
          onEntering={this.handleEntering}
          autoFocus={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType !== "deleteUser" ? (
              <Form onSubmit={this.handleSave}>
                {modalType !== "resetPassword" &&
                  this.renderInput("username", "Username")}
                {this.renderInput("password", "Password", "password")}
                {modalType !== "resetPassword" &&
                  this.renderCheck("isAdmin", "Make this user as Admin")}
              </Form>
            ) : (
              this.renderModalButton(
                "Delete",
                this.handleSave,
                "danger",
                false,
                "btn-block"
              )
            )}
          </Modal.Body>
          {modalType !== "deleteUser" && (
            <Modal.Footer>
              {this.renderModalButton(
                "Save",
                this.handleSave,
                "primary",
                false
              )}
              {this.renderModalButton("Close", onHide, "secondary")}
            </Modal.Footer>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

export default Registration;
