/** @format */

import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class NavigationBar extends Component {
  render() {
    const { user } = this.props;
    return (
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#home">WFCI Accounting System</Navbar.Brand>
        {user && (
          <React.Fragment>
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
                {user.isAdmin && (
                  <React.Fragment>
                    <NavLink className="nav-link" to="/customers">
                      Customers
                    </NavLink>
                    <NavLink className="nav-link" to="/items">
                      Items
                    </NavLink>
                    <NavLink className="nav-link" to="/users">
                      Users
                    </NavLink>
                  </React.Fragment>
                )}
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </React.Fragment>
        )}
      </Navbar>
    );
  }
}

export default NavigationBar;
