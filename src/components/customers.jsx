import React, { Component } from "react";
import { Col, Row, Table, Button, InputGroup, Form } from "react-bootstrap";
import { getCustomers } from "../services/fakeCustomerService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";

class Customers extends Component {
  state = {
    customers: [],
    sortColumn: { path: "name", order: "asc" },
    pageSize: 8,
    currentPage: 1
  };

  columns = [
    { path: "name", label: "Customer Name" },
    { path: "address", label: "Address" },
    { path: "tinNo", label: "TIN No" }
  ];

  async componentDidMount() {
    const customers = await getCustomers();
    this.setState({ customers });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      customers: allCustomers,
      sortColumn
    } = this.state;

    const sorted = _.orderBy(
      allCustomers,
      [sortColumn.path],
      [sortColumn.order]
    );

    const customers = paginate(sorted, currentPage, pageSize);

    return { totalCount: allCustomers.length, data: customers };
  }

  render() {
    const { sortColumn, pageSize, currentPage } = this.state;
    const { totalCount, data: customers } = this.getPagedData();

    return (
      <React.Fragment>
        <Col className="p-5 w-75" md="8">
          <h2>Customers</h2>
          <Row className="justify-content-between">
            <Button className="m-2 btn-primary">
              <i className="fa fa-plus-square"></i> New Customer
            </Button>
            <InputGroup className="m-2 w-25">
              <Form.Control type="text" placeholder="Enter to Search" />
              <InputGroup.Append>
                <Button className="btn-outline">
                  Search <i className="fa fa-search"></i>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Row>
          <Row>
            <Table>
              <TableHeader
                onSort={this.handleSort}
                columns={this.columns}
                sortColumn={sortColumn}
              />
              <TableBody columns={this.columns} data={customers} />
            </Table>
            <PaginationBar
              itemsCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={this.handlePageChange}
            />
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

export default Customers;
