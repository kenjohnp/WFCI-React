import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import SideNav from "./common/sideNav";

const SideBar = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const sideMenu = [
    {
      menu: {
        label: "Sales Orders",
        icon: "fa fa-shopping-cart fa-lg fa-fw",
        subMenu: [
          {
            label: "New Sales Order",
            link: "/salesorders/new",
          },
          {
            label: "View Sales Orders",
            link: "/salesorders",
          },
        ],
      },
    },
    {
      menu: {
        label: "Delivery Receipts",
        icon: "fa fa-truck fa-lg fa-fw",
        subMenu: [
          {
            label: "New Delivery Receipts",
            link: "Link Here",
          },
          {
            label: "View Delivery Receipts",
            link: "Link Here",
          },
        ],
      },
    },
    {
      menu: {
        label: "Sales Invoices",
        icon: "fa fa-dollar fa-lg fa-fw",
        subMenu: [
          {
            label: "New Sales Invoice",
            link: "Link Here",
          },
          {
            label: "View Sales Invoices",
            link: "Link Here",
          },
        ],
      },
    },
    {
      menu: {
        label: "Collections",
        icon: "fa fa-money fa-lg fa-fw",
        subMenu: [
          {
            label: "New Collections",
            link: "Link Here",
          },
          {
            label: "View Collections",
            link: "Link Here",
          },
        ],
      },
    },
    {
      menu: {
        label: "Reports",
        icon: "fa fa-pie-chart fa-lg fa-fw",
        subMenu: [
          {
            label: "Generate Reports",
            link: "Link Here",
          },
          {
            label: "Generate SOA",
            link: "Link Here",
          },
        ],
      },
    },
    {
      menu: {
        label: "Manage Customers",
        icon: "fa fa-address-book fa-lg fa-fw",
        subMenu: [],
        link: "/customers",
      },
    },
    {
      menu: {
        label: "Manage Items",
        icon: "fa fa-shopping-bag fa-lg fa-fw",
        subMenu: [],
        link: "/items",
      },
    },
    {
      menu: {
        label: "Manage Users",
        icon: "fa fa-user fa-lg fa-fw",
        subMenu: [],
        link: "/users",
      },
    },
  ];

  const handleClick = (index) => {
    console.log("clicked", index);
    // setActiveIndex(index);
  };

  return (
    <div className="sidebar pt-5 vh-100">
      <Accordion>
        {sideMenu.map((m, index) => (
          <SideNav
            eventKey={index}
            menu={m.menu}
            key={index}
            active={activeIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default SideBar;
