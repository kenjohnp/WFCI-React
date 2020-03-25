import React from "react";
import { Form, Button } from "react-bootstrap";

const Login = () => {
  return (
    <React.Fragment>
      <Form className="w-25 mx-auto" style={{ marginTop: 250 }}>
        <h3 className="text-center">WFCI Login</h3>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Enter Username" />
        </Form.Group>
        <Form.Group controlId="formUsername">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" />
        </Form.Group>
        <Button variant="primary" type="submit" className="d-block">
          Submit
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default Login;
