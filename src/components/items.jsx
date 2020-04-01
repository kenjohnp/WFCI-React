/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Button } from "react-bootstrap";
import { getItems, deleteItem } from "../services/itemService";
import { paginate } from "../utils/paginate";
import { toast } from "react-toastify";
import PaginationBar from "./common/paginationBar";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import SearchBox from "./common/searchBox";
import ModalForm from "./common/modalForm";
import Item from "./modals/item";
import Delete from "./modals/delete";

class Items extends Component {
  state = {
    items: [],
    searchQuery: "",
    currentPage: 1,
    pageSize: 8,
    sortColumn: { path: "title", order: "asc" },
    selectedId: "",
    modal: { show: false, type: "" }
  };

  columns = [
    { path: "name", label: "Item Name", class: "clickable" },
    {
      key: "delete",
      content: item => (
        <Button
          className="btn-danger btn-sm"
          onClick={() => this.handleModalShow("delete", item._id)}
        >
          Delete
        </Button>
      )
    }
  ];

  async componentDidMount() {
    this.loadItems();
  }

  async loadItems() {
    const { data } = await getItems();
    this.setState({ items: data });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleModalShow = (modalType, id = "") => {
    let modal = this.state.modal;
    modal = { show: true, type: modalType };
    const selectedId = id;
    this.setState({ modal, selectedId });
  };

  handleModalClose = () => {
    let modal = this.state.modal;
    modal.show = false;
    this.setState({ modal });
  };

  handleSave = () => {
    this.loadItems();
  };

  handleDelete = async () => {
    const { selectedId } = this.state;
    const originalItems = this.state.items;
    const items = originalItems.filter(u => u._id !== selectedId);
    this.setState({ items });
    this.handleModalClose();

    try {
      await deleteItem(selectedId);
      toast.error("Succesfully deleted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This item has already been deleted.");

      this.setState({ items: originalItems });
    }
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
    const {
      currentPage,
      pageSize,
      sortColumn,
      searchQuery,
      modal
    } = this.state;
    const { totalCount, data: items } = this.getPagedData();

    const modalProps = {};
    switch (this.state.modal.type) {
      case "delete":
        modalProps.title = "Delete Item";
        modalProps.onSubmit = this.handleDelete;
        break;
      case "newItem":
        modalProps.title = "New Item";
        modalProps.onSubmit = this.handleSave;
        break;
    }

    return (
      <React.Fragment>
        <Col xl="2"></Col>
        <Col className="p-5 w-75" xl="8" md="12">
          <h2>Items</h2>
          <Row className="justify-content-between">
            <Button
              className="m-2 btn-primary"
              onClick={() => this.handleModalShow("newItem")}
            >
              <i className="fa fa-plus-square"></i> New Item
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <ModalForm
              show={modal.show}
              onHide={this.handleModalClose}
              component={this.state.modal.type === "delete" ? Delete : Item}
              {...modalProps}
            />
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
