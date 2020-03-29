/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Badge, Button, InputGroup } from "react-bootstrap";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";
import UsersModal from "./usersModal";
import { paginate } from "../utils/paginate";
import { getUsers } from "../services/fakeUsers";
class Users extends Component {
  state = {
    users: [],
    pageSize: 8,
    currentPage: 1,
    sortColumn: { path: "username", order: "asc" },
    searchQuery: "",
    show: false
  };

  columns = [
    {
      path: "username",
      label: "Username",
      class: "clickable w-30"
    },
    {
      path: "isAdmin",
      label: "Status",
      class: "clickable w-15",
      content: item =>
        item.isAdmin ? (
          <Badge variant="success">Admin</Badge>
        ) : (
          <Badge variant="info">User</Badge>
        )
    },
    {
      key: "changePass",
      class: "w-15",
      content: item => (
        <Button
          className="btn-info btn-sm"
          onClick={() => this.handleChangePassword(item)}
        >
          Reset Password
        </Button>
      )
    },
    {
      key: "delete",
      class: "w-15",
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

  componentDidMount() {
    const users = getUsers();
    this.setState({ users });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleModalShow = () => {
    this.setState({ show: true });
  };

  handleModalClose = () => {
    this.setState({ show: false });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      users: allUsers,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allUsers;

    if (searchQuery)
      filtered = allUsers.filter(u =>
        u.username.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: allUsers.length, data: users };
  }

  render() {
    const { sortColumn, searchQuery, currentPage, pageSize } = this.state;

    const { totalCount, data: users } = this.getPagedData();

    return (
      <React.Fragment>
        <Col xl="2"></Col>
        <Col xl="8" md="12" className="p-5 w-75">
          <h2>Users</h2>
          <Row className="justify-content-between">
            <Button className="m-2 btn-primary" onClick={this.handleModalShow}>
              <i className="fa fa-plus-square"></i> New User
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <UsersModal show={this.state.show} onHide={this.handleModalClose} />
          </Row>
          <Row>
            <Table size="sm">
              <TableHeader
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={this.handleSort}
              />
              <TableBody columns={this.columns} data={users} />
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

export default Users;
