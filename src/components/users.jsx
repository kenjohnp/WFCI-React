/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Badge, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";
import Registration from "./modals/registration";
import { paginate } from "../utils/paginate";
import { getUsers, deleteUser } from "../services/userService";
class Users extends Component {
  state = {
    users: [],
    pageSize: 8,
    currentPage: 1,
    sortColumn: { path: "username", order: "asc" },
    searchQuery: "",
    modal: { show: false, type: "" },
    selectedData: {}
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
          <Badge pill variant="success p-2 clickable">
            Admin
          </Badge>
        ) : (
          <Badge pill variant="info p-2">
            User
          </Badge>
        )
    },
    {
      key: "resetPass",
      class: "w-15",
      content: user => (
        <Button
          className="btn-info btn-sm"
          onClick={() => this.handleModalShow("resetPassword", user)}
        >
          Reset Password
        </Button>
      )
    },
    {
      key: "delete",
      class: "w-15",
      content: user => (
        <Button
          className="btn-danger btn-sm"
          onClick={() => this.handleModalShow("deleteUser", user)}
        >
          Delete
        </Button>
      )
    }
  ];

  async componentDidMount() {
    this.loadUsers();
  }

  async loadUsers() {
    const { data } = await getUsers();
    this.setState({ users: data });
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

  handleSubmit = () => {
    this.loadUsers();
  };

  handleSave = () => {
    this.loadUsers();
  };

  handleModalShow = (modalType, selectedData = {}) => {
    let modal = this.state.modal;
    modal = { show: true, type: modalType };
    this.setState({ modal, selectedData });
  };

  handleModalClose = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
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
    const {
      sortColumn,
      searchQuery,
      currentPage,
      pageSize,
      modal,
      selectedData
    } = this.state;

    const { totalCount, data: users } = this.getPagedData();

    const modalProps = {};
    switch (this.state.modal.type) {
      case "deleteUser":
        modalProps.title = "Delete User";
        break;
      case "newUser":
        modalProps.title = "New User";
        break;
      case "resetPassword":
        modalProps.title = "Reset Password";
        break;
    }

    return (
      <React.Fragment>
        <Col xl="2"></Col>
        <Col xl="8" md="12" className="p-5 w-75">
          <h2>Users</h2>
          <Row className="justify-content-between">
            <Button
              className="m-2 btn-primary"
              onClick={() => this.handleModalShow("newUser")}
            >
              <i className="fa fa-plus-square"></i> New User
            </Button>
            <Registration
              show={modal.show}
              onHide={this.handleModalClose}
              modalType={modal.type}
              users={users}
              selectedData={selectedData}
              onSubmit={this.handleSave}
              {...modalProps}
            />
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
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
