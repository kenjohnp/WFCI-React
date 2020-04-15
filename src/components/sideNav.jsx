import React from "react";
import { NavLink } from "react-router-dom";

const SideNav = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/salesorders/new">New Sales Order</NavLink>
        </li>
        <li>
          <NavLink to="/salesorders">View Sales Orders</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
