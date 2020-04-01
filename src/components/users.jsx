/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";
import ModalForm from "./common/modalForm";
import { paginate } from "../utils/paginate";
import { getUsers, deleteUser } from "../services/userService";
class Users extends Component {
  state = {
    users: [],
    pageSize: 8,
    currentPage: 1,
    sortColumn: { path: "username", order: "asc" },
    searchQuery: "",
    show: false,
    selectedId: ""
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
      key: "changePass",
      class: "w-15",
      content: user => (
        <Button
          className="btn-info btn-sm"
          onClick={() => this.handleChangePassword(user._id)}
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
          onClick={() => this.setState({ show: true, selectedId: user._id })}
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

  handleDelete = async () => {
    const { errors, selectedId } = this.state;
    const originalUsers = this.state.users;
    const users = originalUsers.filter(u => u._id !== selectedId);
    this.setState({ users });
    this.setState({ show: false });
    try {
      await deleteUser(selectedId);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ users: originalUsers });
    }
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
            <Link to="/register">
              <Button className="m-2 btn-primary">
                <i className="fa fa-plus-square"></i> New User
              </Button>
            </Link>
            <ModalForm
              show={this.state.show}
              title="Delete User"
              onDelete={this.handleDelete}
              onHide={this.handleModalClose}
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
