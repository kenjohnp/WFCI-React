import React from "react";
import { Form, Button, Card } from "react-bootstrap";

const Login = () => {
  return (
    <React.Fragment>
      <Card className="w-25 mx-auto" style={{ marginTop: 200 }}>
        <Card.Header className="text-center">
          <strong>WFCI Login</strong>
        </Card.Header>
        <Card.Body>
          <Form>
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
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Login;
