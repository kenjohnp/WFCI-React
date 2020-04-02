/** @format */

import React from "react";
import Joi from "joi-browser";
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
      businessStyle: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Customer Name"),
    contactPerson: Joi.any().label("Contact Person"),
    contactNumber: Joi.any().label("Contact Number"),
    address: Joi.any().label("Address"),
    tinNo: Joi.any().label("TIN No."),
    businessStyle: Joi.any().label("Business Style")
  };

  handleSave = async () => {
    try {
      await saveCustomer(this.state.data);
      this.props.onHide();
      this.props.onSubmit();
      toast.success("Customer successfully added.");
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error(ex.response.data);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Modal.Body>
          <Form>
            {this.renderInput("name", "Customer Name")}
            <Form.Row>
              <Col>{this.renderInput("contactPerson", "Contact Person")}</Col>
              <Col>{this.renderInput("contactNumber", "Contact Number")}</Col>
            </Form.Row>
            {this.renderInput("address", "Address")}
            {this.renderInput("tinNo", "TIN No.")}
            {this.renderInput("businessStyle", "Business Style")}
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

export default Customer;
