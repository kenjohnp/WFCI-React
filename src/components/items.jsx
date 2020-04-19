/** @format */

import React, { Component } from "react";
import _ from "lodash";
import { Col, Row, Table, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getItems, deleteItem } from "../services/itemService";
import { paginate } from "../utils/paginate";
import PaginationBar from "./common/paginationBar";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import SearchBox from "./common/searchBox";
import Item from "./modals/item";

class Items extends Component {
  state = {
    items: [],
    searchQuery: "",
    currentPage: 1,
    pageSize: 8,
    sortColumn: { path: "title", order: "asc" },
    selectedData: {},
    modal: { show: false, type: "" },
  };

  columns = [
    { path: "name", label: "Item Name", class: "clickable" },
    {
      key: "delete",
      content: (item) => (
        <React.Fragment>
          <Button
            className="btn-info btn-sm mr-1"
            onClick={() => this.handleModalShow("editItem", item)}
          >
            Edit
          </Button>
          <Button
            className="btn-danger btn-sm"
            onClick={() => this.handleModalShow("deleteItem", item)}
          >
            Delete
          </Button>
        </React.Fragment>
      ),
    },
  ];

  async componentDidMount() {
    this.loadItems();
  }

  async loadItems() {
    const { data } = await getItems();
    this.setState({ items: data });
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
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

  handleSave = (item) => {
    this.loadItems();
  };

  handleDelete = async (item) => {
    const originalItems = [...this.state.items];
    const items = originalItems.filter((i) => i._id !== item._id);
    this.setState({ items });

    try {
      await deleteItem(item._id);
      toast.success("Item deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error(ex.response.data);
      this.setState({ items: originalItems });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      items: allItems,
      sortColumn,
      searchQuery,
    } = this.state;

    let filtered = allItems;
    if (searchQuery)
      filtered = allItems.filter((i) =>
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
      modal,
      selectedData,
    } = this.state;
    const { totalCount, data: items } = this.getPagedData();

    const modalProps = {};
    switch (this.state.modal.type) {
      case "deleteItem":
        modalProps.title = "Delete Item";
        modalProps.onSubmit = this.handleDelete;
        break;
      case "newItem":
        modalProps.title = "New Item";
        modalProps.onSubmit = this.handleSave;
        break;
      case "editItem":
        modalProps.title = "Edit Item";
        modalProps.onSubmit = this.handleSave;
        break;
      default:
        modalProps.title = "Undefined";
        modalProps.onSubmit = this.handleSave;
        break;
    }

    return (
      <React.Fragment>
        <Col className="p-5 w-100">
          <h2>Items</h2>
          <Row className="justify-content-between">
            <Button
              className="m-2 btn-primary"
              onClick={() => this.handleModalShow("newItem")}
            >
              <i className="fa fa-plus-square"></i> New Item
            </Button>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <Item
              show={modal.show}
              onHide={this.handleModalClose}
              modalType={modal.type}
              items={items}
              selectedData={selectedData}
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
