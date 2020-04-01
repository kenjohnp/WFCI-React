/** @format */

import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import auth from "./services/authService";
import NavigationBar from "./components/navigationBar";
import Login from "./components/login";
import Items from "./components/items";
import Customers from "./components/customers";
import Users from "./components/users";
import Register from "./components/register";
import Logout from "./components/logout";
import NotFound from "./components/notFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ProtectedRoute from "./components/common/protectedRoute";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <NavigationBar user={user} />
        <ToastContainer />
        <Container fluid>
          <Row>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute path="/customers" component={Customers} />
              <ProtectedRoute path="/items" component={Items} />
              <ProtectedRoute path="/users" component={Users} />
              <ProtectedRoute path="/register" component={Register} />
              <ProtectedRoute path="/" exact component={Customers} />
              <Redirect to="/not-found" component={NotFound} />
            </Switch>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
