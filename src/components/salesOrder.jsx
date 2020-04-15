import React, { Component } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import { getSalesOrders } from "../services/soService";

class SalesOrder extends Component {
  state = {
    salesOrders: [],
    sortColumn: { path: "soDate", order: "desc" },
  };

  columns = [
    {
      path: "soDate",
      label: "SO Date",
    },
    {
      path: "customer.name",
      label: "Customer Name",
    },
    {
      path: "soRefNo",
      label: "SO Reference No.",
    },
    {
      path: "dateModified",
      label: "Date Created",
    },
  ];

  async componentDidMount() {
    const { data } = await getSalesOrders();

    for (let i = 0; i < data.length; i++) {
      data[i].soDate = moment(data[i].soDate).format("MM/DD/YYYY");
      data[i].dateModified = moment(data[i].dateModified).format(
        "MM/DD/YYYY h:mm a"
      );
    }

    this.setState({ salesOrders: data });
  }

  render() {
    return (
      <React.Fragment>
        <Col className="mt-3">
          <h4>Sales Orders</h4>
          <Table hover bordered className="clickable" size="sm">
            <TableHeader
              columns={this.columns}
              sortColumn={this.state.sortColumn}
              onSort={this.handleSort}
            />
            <TableBody
              columns={this.columns}
              data={this.state.salesOrders}
              clickable={true}
              clickableTo={"/salesorders/"}
              history={this.props.history}
            />
          </Table>
        </Col>
      </React.Fragment>
    );
  }
}

export default SalesOrder;
