/** @format */

import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import SideBar from "./sideBar";

class NavigationBar extends Component {
  render() {
    const { showSideBar, onChange, hideSideBar } = this.props;
    return (
      <React.Fragment>
        <input
          type="checkbox"
          id="check"
          checked={showSideBar}
          onChange={onChange}
        />
        <SideBar hideSideBar={hideSideBar} />
        <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
          <label htmlFor="check" className="mb-0">
            <i className="fa fa-bars fa-lg mr-2 text-white" id="btn"></i>
            <Navbar.Brand id="btn">WFCI</Navbar.Brand>
          </label>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default NavigationBar;
