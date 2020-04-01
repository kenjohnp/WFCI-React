/** @format */

import React from "react";
import { Form, Alert } from "react-bootstrap";

const Input = ({ label, name, error, ...rest }) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} {...rest} id={name}></Form.Control>
      {error && <Alert variant="danger">{error}</Alert>}
    </Form.Group>
  );
};

export default Input;
