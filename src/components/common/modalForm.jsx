/** @format */

import React from "react";
import { Modal } from "react-bootstrap";
const ModalForm = ({ show, title, onSubmit, onHide, component: Component }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Component onSubmit={onSubmit} onHide={onHide} />
    </Modal>
  );
};

export default ModalForm;
