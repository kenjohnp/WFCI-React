/** @format */

import React from "react";
import { saveItem } from "../../services/itemService";
import { toast } from "react-toastify";
import { Modal, Form } from "react-bootstrap";
import FormHelper from "../common/formHelper";
import Joi from "joi-browser";

class Item extends FormHelper {
  state = { data: { name: "" }, errors: {} };

  schema = {
    name: Joi.string()
      .required()
      .label("Item Name")
  };

  handleSave = async () => {
    try {
      await saveItem(this.state.data);
      this.props.onHide();
      this.props.onSubmit();
      toast.success("Item added successfully.");
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
          <Form>{this.renderInput("name", "Item Name")}</Form>
        </Modal.Body>
        <Modal.Footer>
          {this.renderModalButton("Save", this.handleSave, "primary", true)}
          {this.renderModalButton("Close", this.props.onHide, "secondary")}
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

export default Item;
