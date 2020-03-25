import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavigationBar from "./components/navigationBar";
import Login from "./components/login";
import Items from "./components/items";
import Customers from "./components/customers";
import SideNav from "./components/sideNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <NavigationBar />
      <Container fluid>
        <Row>
          {/* <SideNav /> */}
          <Login />
          {/* <Items /> */}
          {/* <Customers /> */}
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default App;
