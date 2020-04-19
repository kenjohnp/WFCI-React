/** @format */

import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import auth from "./services/authService";
import NavigationBar from "./components/navigationBar";
import Login from "./components/login";
import SideBar from "./components/sideBar";
import SalesOrder from "./components/salesOrder";
import NewSalesOrder from "./components/newSalesOrder";
import Items from "./components/items";
import Customers from "./components/customers";
import Users from "./components/users";
import Logout from "./components/logout";
import NotFound from "./components/notFound";
import ProtectedRoute from "./components/common/protectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

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
            <SideBar />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute
                path="/salesorders/:id"
                component={NewSalesOrder}
              />
              <ProtectedRoute path="/salesorders" component={SalesOrder} />
              <ProtectedRoute path="/customers" component={Customers} />
              <ProtectedRoute path="/items" component={Items} />
              <ProtectedRoute path="/users" component={Users} />
              <ProtectedRoute path="/" exact component={SalesOrder} />
              <Redirect to="/not-found" component={NotFound} />
            </Switch>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
