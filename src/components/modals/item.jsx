/** @format */

import React from "react";
import _ from "lodash";
import { saveItem } from "../../services/itemService";
import { toast } from "react-toastify";
import { Modal, Form } from "react-bootstrap";
import FormHelper from "../common/formHelper";
import Joi from "joi-browser";

class Item extends FormHelper {
  state = { data: { name: "" }, errors: {} };

  schema = {
    name: Joi.string().required().label("Item Name"),
  };

  resetModal = () => {
    const data = { name: "" };
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
        case "newItem":
          await saveItem(this.state.data);
          toast.success("Item added successfully.");
          break;
        case "editItem":
          toast.success("Item edited successfully.");
          await saveItem(this.state.data);
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
    const { title, show, onHide, modalType } = this.props;

    return (
      <React.Fragment>
        <Modal
          show={show}
          onHide={onHide}
          onEntering={this.handleEntering}
          enforceFocus
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalType !== "deleteItem" ? (
              <Form onSubmit={this.handleSave}>
                {this.renderInput("name", "Item Name")}
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
          {modalType !== "deleteItem" && (
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

export default Item;
