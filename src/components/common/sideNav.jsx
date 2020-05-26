import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";

function SideNav({ menu, eventKey, active, onClick, hideSideBar }) {
  const accordion = (
    <Accordion.Toggle
      eventKey={eventKey}
      className={
        active ? "clickable sidenav sidenav-active" : "clickable sidenav"
      }
      onClick={onClick}
    >
      <i className={menu.icon}></i>{" "}
      <span className="ml-1">{menu.label.toUpperCase()}</span>
    </Accordion.Toggle>
  );

  return (
    <div>
      {menu.link ? (
        <Link to={menu.link} style={{ textDecoration: "none", color: "#fff" }}>
          {accordion}
        </Link>
      ) : (
        accordion
      )}
      <Accordion.Collapse eventKey={eventKey}>
        <ul className="m-0">
          {menu.subMenu.map((menu, index) => (
            <li key={index}>
              <NavLink to={menu.link} onClick={hideSideBar}>
                <i className={menu.icon}></i>
                <span> {menu.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </Accordion.Collapse>
    </div>
  );
}

export default SideNav;
