/** @format */

import React from "react";
import { Form } from "react-bootstrap";

const CheckBox = ({ label, name, ...rest }) => {
  return (
    <Form.Group>
      <Form.Check
        name={name}
        {...rest}
        id={name}
        type="checkbox"
        label={label}
      ></Form.Check>
    </Form.Group>
  );
};

export default CheckBox;
