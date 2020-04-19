import React from "react";
import { NavLink, Link, Route } from "react-router-dom";
import { Accordion } from "react-bootstrap";

function SideNav({ menu, eventKey, active, onClick }) {
  return (
    <div>
      <Link to={menu.link} style={{ textDecoration: "none", color: "#fff" }}>
        <Accordion.Toggle
          eventKey={eventKey}
          className={
            active ? "clickable sidenav sidenav-active" : "clickable sidenav"
          }
          onClick={onClick}
        >
          <i className={menu.icon}></i> {menu.label.toUpperCase()}
        </Accordion.Toggle>
      </Link>
      <Accordion.Collapse eventKey={eventKey}>
        <ul className="m-0">
          {menu.subMenu.map((menu, index) => (
            <li key={index}>
              <NavLink to={menu.link}>{menu.label}</NavLink>
            </li>
          ))}
        </ul>
      </Accordion.Collapse>
    </div>
  );
}

export default SideNav;
