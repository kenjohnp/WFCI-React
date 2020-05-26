/** @format */

import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import auth from "./services/authService";
import NavigationBar from "./components/navigationBar";
import Login from "./components/login";
import SalesOrder from "./components/salesOrder";
import NewSalesOrder from "./components/newSalesOrder";
import NewDeliveryReceipt from "./components/newDeliveryReceipt";
import Items from "./components/items";
import Customers from "./components/customers";
import Users from "./components/users";
import Logout from "./components/logout";
import NotFound from "./components/notFound";
import ProtectedRoute from "./components/common/protectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toggle-switch/dist/css/switch.min.css";
import "./App.css";

class App extends Component {
  state = { showSideBar: false };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  handleShowSideBar = () => {
    const showSideBar = !this.state.showSideBar;
    this.setState({ showSideBar });
  };

  hideSideBar = () => {
    this.setState({ showSideBar: false });
  };

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <NavigationBar
          user={user}
          showSideBar={this.state.showSideBar}
          onChange={this.handleShowSideBar}
          hideSideBar={this.hideSideBar}
        />
        <ToastContainer />
        <div className="dimmer" onClick={this.hideSideBar}></div>
        <Container className="main-content mt-1 pt-5">
          <Row>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute
                path="/salesorders/:id"
                component={NewSalesOrder}
              />
              <ProtectedRoute
                path="/deliveryreceipts/:id"
                component={NewDeliveryReceipt}
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
