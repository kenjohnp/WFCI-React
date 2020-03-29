import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import NavigationBar from "./components/navigationBar";
import Login from "./components/login";
import Items from "./components/items";
import Customers from "./components/customers";
import Users from './components/users';
import NotFound from "./components/notFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <NavigationBar />
      <Container fluid>
        <Row>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/customers" component={Customers} />
            <Route path="/items" component={Items} />
            <Route path="/users" component={Users} />
            <Route path="/" exact component={Login} />
            <Redirect to="/not-found" component={NotFound} />
          </Switch>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default App;
