/** @format */

import React from "react";
import Joi from "joi-browser";
import _ from "lodash";
import { Modal, Form, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { saveCustomer } from "../../services/customerService";
import FormHelper from "../common/formHelper";

class Customer extends FormHelper {
  state = {
    data: {
      name: "",
      contactPerson: "",
      contactNumber: "",
      address: "",
      tinNo: "",
      businessStyle: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().label("Customer Name"),
    contactPerson: Joi.any().label("Contact Person"),
    contactNumber: Joi.any().label("Contact Number"),
    address: Joi.any().label("Address"),
    tinNo: Joi.any().label("TIN No."),
    businessStyle: Joi.any().label("Business Style"),
  };

  resetModal = () => {
    const data = {
      name: "",
      contactPerson: "",
      contactNumber: "",
      address: "",
      tinNo: "",
      businessStyle: "",
    };
    const errors = {};
    this.setState({ data, errors });
  };

  handleEntering = () => {
    this.resetModal();
    const { selectedData } = this.props;
    if (!_.isEmpty(selectedData)) {
      const data = selectedData;
      this.setState({ data });
    }
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { modalType, onHide, onSubmit, selectedData } = this.props;

    try {
      if (!_.isEmpty(selectedData)) {
        const data = this.state.data;
        data._id = selectedData._id;
        this.setState({ data });
      }

      switch (modalType) {
        case "new":
          await saveCustomer(this.state.data);
          toast.success("Customer added successfully.");
          break;
        case "edit":
          await saveCustomer(this.state.data);
          toast.success("Customer edited successfully.");
          break;
        default:
          break;
      }

      this.resetModal();
      onHide();
      onSubmit(selectedData);
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error(ex.response.data);
    }
  };

  render() {
    const { title, show, onHide, modalType } = this.props;
    return (
      <React.Fragment>
        <Modal show={show} onHide={onHide} onEntering={this.handleEntering}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType !== "delete" ? (
              <Form onSubmit={this.handleSave}>
                {this.renderInput("name", "Customer Name")}
                <Form.Row>
                  <Col>
                    {this.renderInput("contactPerson", "Contact Person")}
                  </Col>
                  <Col>
                    {this.renderInput("contactNumber", "Contact Number")}
                  </Col>
                </Form.Row>
                {this.renderInput("address", "Address")}
                {this.renderInput("tinNo", "TIN No.")}
                {this.renderInput("businessStyle", "Business Style")}
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
          {modalType !== "delete" && (
            <Modal.Footer>
              {this.renderModalButton(
                "Save",
                this.handleSave,
                "primary",
                false
              )}
              {this.renderModalButton("Close", this.props.onHide, "secondary")}
            </Modal.Footer>
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

export default Customer;
