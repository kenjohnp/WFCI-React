import React, { Component } from "react";
import { Row, Col, Table } from "react-bootstrap";
import _ from "lodash";
import moment from "moment";
import { paginate } from "../utils/paginate";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";
import { getSalesOrders } from "../services/soService";

class SalesOrder extends Component {
  state = {
    salesOrders: [],
    sortColumn: { path: "soDate", order: "desc" },
    searchQuery: "",
    pageSize: 8,
    currentPage: 1,
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

  buttonGroup = [
    {
      label: "New",
      onClick: this.handleClear,
      icon: "fa fa-close",
      variant: "primary",
    },
  ];

  async componentDidMount() {
    const { data } = await getSalesOrders();

    for (let item of data) {
      item.soDate = moment(item.soDate).format("MM/DD/YYYY");
      item.dateModified = moment(item.dateModified).format("MM/DD/YYYY h:mm a");
    }

    this.setState({ salesOrders: data });
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      salesOrders: allSalesOrders,
      sortColumn,
      searchQuery,
    } = this.state;

    let filtered = allSalesOrders;

    if (searchQuery)
      filtered = allSalesOrders.filter(
        (s) =>
          s.customer.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          s.soRefNo.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const salesOrders = paginate(sorted, currentPage, pageSize);

    return { totalCount: allSalesOrders.length, data: salesOrders };
  }

  render() {
    const { searchQuery, currentPage, pageSize, sortColumn } = this.state;
    const { totalCount, data: salesOrders } = this.getPagedData();
    return (
      <React.Fragment>
        <Col className="mt-3">
          <h4>Sales Orders</h4>
          <Row className="justify-content-end px-2">
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </Row>

          <Table hover bordered className="clickable">
            <TableHeader
              columns={this.columns}
              sortColumn={sortColumn}
              onSort={this.handleSort}
            />
            <TableBody
              columns={this.columns}
              data={salesOrders}
              clickable={true}
              clickableTo={"/salesorders/"}
              history={this.props.history}
            />
          </Table>
          <PaginationBar
            itemsCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
          />
        </Col>
      </React.Fragment>
    );
  }
}

export default SalesOrder;
