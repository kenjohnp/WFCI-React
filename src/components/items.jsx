/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Button } from "react-bootstrap";
import { getItems } from "../services/fakeItemService";
import { paginate } from "../utils/paginate";
import PaginationBar from "./common/paginationBar";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import SearchBox from "./common/searchBox";

class Items extends Component {
  state = {
    items: [],
    searchQuery: "",
    currentPage: 1,
    pageSize: 8,
    sortColumn: { path: "title", order: "asc" }
  };

  columns = [
    { path: "name", label: "Item Name", class: "clickable" },
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
    const items = await getItems();
    this.setState({ items });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleDelete = item => {
    console.log(item);
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      items: allItems,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allItems;
    if (searchQuery)
      filtered = allItems.filter(i =>
        i.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const items = paginate(sorted, currentPage, pageSize);

    return { totalCount: allItems.length, data: items };
  }

  render() {
    const { currentPage, pageSize, sortColumn, searchQuery } = this.state;
    const { totalCount, data: items } = this.getPagedData();

    return (
      <React.Fragment>
        <Col xl="2"></Col>
        <Col className="p-5 w-75" xl="8" md="12">
          <h2>Items</h2>
          <Row className="justify-content-between">
            <Button className="m-2 btn-primary">
              <i className="fa fa-plus-square"></i> New Item
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
          </Row>
          <Row>
            <Table size="sm">
              <TableHeader
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={this.handleSort}
              />
              <TableBody columns={this.columns} data={items} />
            </Table>
            <PaginationBar
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </Row>
        </Col>
        <Col xl="2"></Col>
      </React.Fragment>
    );
  }
}

export default Items;
