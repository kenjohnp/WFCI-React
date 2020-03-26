import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Button, InputGroup, Form } from "react-bootstrap";
import { getItems } from "../services/fakeItemService";
import { paginate } from "../utils/paginate";
import PaginationBar from "./common/paginationBar";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";

class Items extends Component {
  state = {
    items: [],
    currentPage: 1,
    pageSize: 8,
    sortColumn: { path: "title", order: "asc" }
  };

  columns = [
    { path: "name", label: "Item Name" },
    {
      key: "delete",
      content: item => (
        <Button className="btn-danger" onClick={() => this.handleDelete(item)}>
          Delete
        </Button>
      )
    }
  ];

  async componentDidMount() {
    const items = await getItems();
    this.setState({ items });
  }

  handleDelete = item => {
    console.log(item);
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData() {
    const { pageSize, currentPage, items: allItems, sortColumn } = this.state;

    const sorted = _.orderBy(allItems, [sortColumn.path], [sortColumn.order]);

    const items = paginate(sorted, currentPage, pageSize);

    return { totalCount: allItems.length, data: items };
  }

  render() {
    const { currentPage, pageSize, sortColumn } = this.state;
    const { totalCount, data: items } = this.getPagedData();

    return (
      <React.Fragment>
        <Col md="2"></Col>
        <Col className="p-5 w-75" md="8">
          <h2>
            Items <span className="d-inline h-5">({totalCount} items)</span>
          </h2>
          <Row className="justify-content-between">
            <Button className="m-2 btn-primary">
              <i className="fa fa-plus-square"></i> New Item
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
      </React.Fragment>
    );
  }
}

export default Items;
