/** @format */

import React from "react";
import { Modal, Button } from "react-bootstrap";

const Delete = ({ onSubmit, onHide }) => {
  return (
    <React.Fragment>
      <Modal.Body>Are you sure you want to delete?</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onSubmit}>
          Delete
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </React.Fragment>
  );
};

export default Delete;
