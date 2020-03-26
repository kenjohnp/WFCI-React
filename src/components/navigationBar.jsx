import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

class NavigationBar extends Component {
  render() {
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">WFCI Accounting System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-5">
            <NavLink className="nav-link" to="/salesorder">
              Sales Orders
            </NavLink>
            <NavLink className="nav-link" to="/deliveryreceipts">
              Delivery Receipts
            </NavLink>
            <NavLink className="nav-link" to="/salesinvoices">
              Sales Invoice
            </NavLink>
            <NavLink className="nav-link" to="/collections">
              Collections
            </NavLink>
            <NavDropdown title="Manage">
              <NavDropdown.Item>
                <Link to="/customers" className="dropdown-item">
                  Customers
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/items" className="dropdown-item">
                  Items
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/users" className="dropdown-item">
                  Users
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
            <NavLink className="nav-link" to="/logout">
              Logout
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavigationBar;
