/** @format */

import React, { Component } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import { getCustomers } from "../services/fakeCustomerService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";

class Customers extends Component {
  state = {
    customers: [],
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
    pageSize: 8,
    currentPage: 1
  };

  columns = [
    { path: "name", label: "Customer Name" },
    { path: "address", label: "Address" },
    {
      key: "delete",
      content: item => (
        <Button
          className="btn-danger btn-sm"
          onClick={() => this.handleDelete(item)}
        >
          Delete
        </Button>
      )
    }
  ];

  async componentDidMount() {
    const customers = await getCustomers();
    this.setState({ customers });
  }

  handleDelete = item => {
    console.log(item);
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

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
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allCustomers;
    if (searchQuery)
      filtered = allCustomers.filter(c =>
        c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const customers = paginate(sorted, currentPage, pageSize);

    return { totalCount: allCustomers.length, data: customers };
  }

  render() {
    const { sortColumn, pageSize, currentPage, searchQuery } = this.state;
    const { totalCount, data: customers } = this.getPagedData();

    return (
      <React.Fragment>
        <Col xl="1"></Col>
        <Col className="p-5 w-75" xl="10" md="12">
          <h2>Customers</h2>
          <Row className="justify-content-between">
            <Button className="m-2 btn-primary">
              <i className="fa fa-plus-square"></i> New Customer
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </Row>
          <Row>
            <Table size="sm" hover className="clickable">
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
        <Col xl="1"></Col>
      </React.Fragment>
    );
  }
}

export default Customers;
