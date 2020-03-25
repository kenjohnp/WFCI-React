import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="#home">WFCI Accounting System</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-5">
          <Nav.Link href="#home">Sales Orders</Nav.Link>
          <Nav.Link href="#home">Delivery Receipts</Nav.Link>
          <Nav.Link href="#home">Sales Invoice</Nav.Link>
          <Nav.Link href="#home">Collections</Nav.Link>
          <NavDropdown href="#home" title="Manage">
            <NavDropdown.Item href="#">Customers</NavDropdown.Item>
            <NavDropdown.Item href="#">Items</NavDropdown.Item>
            <NavDropdown.Item href="#">Users</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#home">Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
