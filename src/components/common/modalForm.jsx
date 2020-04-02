/** @format */

import React from "react";
import { Modal } from "react-bootstrap";
const ModalForm = ({ show, title, component: Component, onHide, ...rest }) => {
  console.log(Component);
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Component onHide={onHide} {...rest} />
    </Modal>
  );
};

export default ModalForm;
