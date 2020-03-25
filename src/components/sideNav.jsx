import React from "react";
import { Nav, Col } from "react-bootstrap";

const SideNav = () => {
  return (
    <Col md="2" className="bg-light py-5 vh-100">
      <Nav className="flex-column">
        <Nav.Link href="/home" className="text-dark">
          New Sales Order
        </Nav.Link>
        <Nav.Link href="/home" className="text-dark">
          List of Sales Orders
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default SideNav;
