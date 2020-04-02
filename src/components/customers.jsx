/** @format */

import React, { Component } from "react";
import { Col, Row, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCustomers, deleteCustomer } from "../services/customerService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import PaginationBar from "./common/paginationBar";
import SearchBox from "./common/searchBox";
import ModalForm from "./common/modalForm";
import Delete from "./modals/delete";
import Customer from "./modals/customer";

class Customers extends Component {
  state = {
    customers: [],
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
    pageSize: 8,
    currentPage: 1,
    selectedData: "",
    modal: { show: false, type: "" }
  };

  columns = [
    { path: "name", label: "Customer Name" },
    { path: "address", label: "Address" },
    {
      key: "delete",
      content: customer => (
        <Button
          className="btn-danger btn-sm"
          onClick={() => this.handleModalShow("delete", customer._id)}
        >
          Delete
        </Button>
      )
    }
  ];

  componentDidMount() {
    this.loadCustomers();
  }

  async loadCustomers() {
    const { data } = await getCustomers();
    this.setState({ customers: data });
  }

  handleModalShow = (modalType, id = "") => {
    let modal = this.state.modal;
    modal = { show: true, type: modalType };
    this.setState({ modal, selectedData: id });
  };

  handleModalClose = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
  };

  handleSave = () => {
    this.loadCustomers();
  };

  handleDelete = async () => {
    const { selectedData } = this.state;
    const originalCustomers = this.state.customers;
    const customers = originalCustomers.filter(u => u._id !== selectedData);
    this.setState({ customers });
    this.handleModalClose();

    try {
      await deleteCustomer(selectedData);
      toast.error("Succesfully deleted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This customer has already been deleted.");

      this.setState({ items: originalCustomers });
    }
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
    const {
      sortColumn,
      pageSize,
      currentPage,
      searchQuery,
      modal
    } = this.state;
    const { totalCount, data: customers } = this.getPagedData();

    const modalProps = {};
    switch (modal.type) {
      case "delete":
        modalProps.title = "Delete Item";
        modalProps.onSubmit = this.handleDelete;
        break;
      case "newCustomer":
        modalProps.title = "New Customer";
        modalProps.onSubmit = this.handleSave;
        break;
    }

    return (
      <React.Fragment>
        <Col xl="1"></Col>
        <Col className="p-5 w-75" xl="10" md="12">
          <h2>Customers</h2>
          <Row className="justify-content-between">
            <Button
              className="m-2 btn-primary"
              onClick={() => this.handleModalShow("newCustomer")}
            >
              <i className="fa fa-plus-square"></i> New Customer
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <ModalForm
              show={modal.show}
              onHide={this.handleModalClose}
              component={modal.type === "delete" ? Delete : Customer}
              {...modalProps}
            />
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
