import React, { Component } from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  Table,
  Form,
  Button,
  ButtonGroup,
  Alert,
} from "react-bootstrap";
import Select from "react-select";
import { getCustomers } from "../services/customerService";
import { getItems } from "../services/itemService";
import { saveSalesOrder, getSalesOrder } from "../services/soService";
import SoDetails from "./salesOrders/soDetails";
import SoSummary from "./salesOrders/soSummary";
import TableHeader from "./common/tableHeader";
import TableBody from "./common/tableBody";
import "react-datepicker/dist/react-datepicker.css";

class NewSalesOrder extends Component {
  state = {
    customers: [],
    selectedCustomer: null,
    customerOptions: [],
    items: [],
    itemsOptions: [],
    salesOrder: {
      soItems: [{ item: "", qty: 0, price: 0, index: 0 }],
      name: "",
      date: new Date(),
      soRefNo: "",
      remarks: "",
      vatableSales: 0,
      vatExemptSales: 0,
      zeroRatedSales: 0,
      vatAmount: 0,
      totalAmount: 0,
    },
    errors: {},
  };

  columns = [
    {
      path: "salesOrder.soItems.item",
      label: "Item Name",
      width: "600px",
      content: (item) => (
        <Select
          options={this.filterSelected()}
          onChange={(selectedItem) =>
            this.handleChangeItem(
              selectedItem,
              this.state.salesOrder.soItems.indexOf(item)
            )
          }
          value={
            this.state.salesOrder.soItems[
              this.state.salesOrder.soItems.indexOf(item)
            ].item
          }
        />
      ),
    },
    {
      path: "salesOrder.soItems.qty",
      label: "Qty",
      content: (item) => (
        <Form.Control
          type="number"
          min="0"
          name="qty"
          value={item.qty}
          onChange={(currentTarget) =>
            this.handleChangeItemDetails(
              currentTarget,
              this.state.salesOrder.soItems.indexOf(item)
            )
          }
        />
      ),
    },
    {
      path: "salesOrder.soItems.price",
      label: "Unit Price",
      content: (item) => (
        <Form.Control
          type="number"
          min="0"
          name="price"
          value={item.price}
          onChange={(currentTarget) =>
            this.handleChangeItemDetails(
              currentTarget,
              this.state.salesOrder.soItems.indexOf(item)
            )
          }
        ></Form.Control>
      ),
    },
    {
      label: "Total Amount",
      key: "total",
      content: (item) => (
        <Form.Control value={item.price * item.qty} readOnly></Form.Control>
      ),
    },
    {
      key: "delete",
      content: (item) =>
        item.item !== "" && (
          <Button
            variant="danger"
            onClick={() =>
              this.handleDeleteItem(this.state.salesOrder.soItems.indexOf(item))
            }
          >
            Delete
          </Button>
        ),
    },
  ];

  schema = Joi.object({
    name: Joi.string().required().label("Customer Name"),
    date: Joi.date().required().label("SO Date"),
    soRefNo: Joi.string().required().label("SO Reference No."),
    soItems: Joi.array()
      .items(
        Joi.object({
          item: Joi.object().required(),
          qty: Joi.number().required().min(1).label("Qty"),
          price: Joi.number().required(),
        })
      )
      .required()
      .min(1)
      .label("SO Items"),
  });

  validate = () => {
    const options = { abortEarly: true, allowUnknown: true };
    this.state.salesOrder.soItems.pop();
    const { error } = Joi.validate(this.state.salesOrder, this.schema, options);
    this.handleAddItem();
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  componentDidMount() {
    this.loadSelect();
    this.populateSalesOrder();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) this.handleClear();
  }

  async loadSelect() {
    const customers = await getCustomers();
    const customerOptions = customers.data.map((c) => ({
      label: c.name,
      value: c._id,
    }));

    const items = await getItems();
    const itemsOptions = items.data.map((i) => ({
      label: i.name,
      value: i._id,
    }));

    this.setState({ customers, customerOptions, items, itemsOptions });
  }

  async populateSalesOrder() {
    try {
      const soId = this.props.match.params.id;
      if (soId === "new") return;

      const { data: salesOrder } = await getSalesOrder(soId);
      this.setState({ salesOrder: this.mapToViewModel(salesOrder) });
      this.computeTotalAmount();
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapToViewModel(salesOrder) {
    const selectedCustomer = {
      label: salesOrder.customer.name,
      value: salesOrder.customer.value,
    };

    this.setState({ selectedCustomer });
    return {
      _id: salesOrder._id,
      soItems: salesOrder.soItems,
      name: salesOrder.customer.name,
      date: new Date(salesOrder.soDate),
      soRefNo: salesOrder.soRefNo,
      remarks: salesOrder.remarks,
      vatableSales: 0,
      vatExemptSales: 0,
      zeroRatedSales: 0,
      vatAmount: 0,
      totalAmount: 0,
    };
  }

  handleClear = () => {
    const salesOrder = {
      soItems: [
        {
          item: "",
          qty: 0,
          price: 0,
          index: 0,
        },
      ],
      name: "",
      date: new Date(),
      soRefNo: "",
      remarks: "",
      vatableSales: 0,
      vatExemptSales: 0,
      zeroRatedSales: 0,
      vatAmount: 0,
      totalAmount: 0,
    };

    const selectedCustomer = null;
    this.setState({ salesOrder, selectedCustomer });
  };

  handleAddItem = () => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems.push({
      item: "",
      qty: 0,
      price: 0,
      index: this.state.salesOrder.soItems.length,
    });
    this.resetIndex();
    this.setState({ salesOrder });
  };

  resetIndex = () => {
    let salesOrder = this.state.salesOrder;
    for (let i = 0; i < salesOrder.soItems.length; i++) {
      salesOrder.soItems[i].index = i;
    }
    this.setState({ salesOrder });
  };

  handleDeleteItem = (index) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems.splice(index, 1);
    this.resetIndex();
    this.setState({ salesOrder });
  };

  handleChangeDetails = ({ currentTarget: input }) => {
    let salesOrder = { ...this.state.salesOrder };
    salesOrder[input.name] = input.value;
    this.setState({ salesOrder });
  };

  handleChangeItemDetails = ({ currentTarget: input }, index) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems[index][input.name] = input.value;
    this.setState({ salesOrder });
    this.computeTotalAmount();
  };

  handleChangeCustomer = (selectedCustomer) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.name = selectedCustomer.label;
    this.setState({ selectedCustomer, salesOrder });
  };

  handleChangeItem = (selectedItem, index) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems[index].item = selectedItem;

    if (salesOrder.soItems[salesOrder.soItems.length - 1].item !== "")
      this.handleAddItem();

    this.setState({ salesOrder });
  };

  filterSelected = () => {
    const { salesOrder, itemsOptions } = this.state;

    let newItemsOptions = [];
    for (let i = 0; i < salesOrder.soItems.length; i++) {
      newItemsOptions.push(salesOrder.soItems[i].item);
    }

    newItemsOptions = itemsOptions.filter((i) => !newItemsOptions.includes(i));

    return newItemsOptions;
  };

  handleChangeDate = (date) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.date = date;
    this.setState({ salesOrder });
  };

  handleSort = () => {};

  handleSave = async () => {
    try {
      const errors = this.validate();
      this.setState({ errors: errors || {} });
      if (errors) return console.log(errors);

      const { salesOrder, selectedCustomer } = this.state;
      let soItems = [...salesOrder.soItems];

      soItems.pop();

      const payload = {
        customerId: selectedCustomer.value,
        soRefNo: salesOrder.soRefNo,
        soDate: salesOrder.date,
        remarks: salesOrder.remarks,
        soItems,
      };

      await saveSalesOrder(payload);
      toast.success("Successfully Saved!");
      this.handleClear();
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error(ex.response.data);
      console.log(ex);
    }
  };

  computeTotalAmount() {
    const { soItems } = this.state.salesOrder;

    const salesOrder = this.state.salesOrder;
    salesOrder.totalAmount = 0;
    for (let i = 0; i < soItems.length; i++) {
      salesOrder.totalAmount += soItems[i].qty * soItems[i].price;
    }

    salesOrder.vatableSales = salesOrder.totalAmount / 1.12;
    salesOrder.vatAmount = salesOrder.totalAmount - salesOrder.vatableSales;

    this.setState({ salesOrder });
  }

  render() {
    const {
      customerOptions,
      selectedCustomer,
      errors,
      salesOrder,
    } = this.state;

    return (
      <Col className="mt-3">
        {Object.values(errors)[0] && (
          <Alert variant="danger">{Object.values(errors)[0]}</Alert>
        )}
        <Row>
          <Col className="d-flex justify-content-between">
            <h4>New Sales Order</h4>
            <ButtonGroup>
              {this.props.match.params.id !== "new" && (
                <React.Fragment>
                  <Button variant="danger" onClick={this.handleClear}>
                    <i className="fa fa-close"></i> Cancel
                  </Button>
                  <Button
                    className="text-white"
                    variant="warning"
                    onClick={this.handleClear}
                  >
                    <i className="fa fa-truck fa-lg"></i> Delivery Receipts
                  </Button>
                  <Button variant="info" onClick={this.handleClear}>
                    <i className="fa fa-dollar"></i> Sales Invoices
                  </Button>
                  <Button variant="success" onClick={this.handleClear}>
                    <i className="fa fa-money"></i> Collections
                  </Button>
                  <Button variant="secondary" onClick={this.handleClear}>
                    <i className="fa fa-print"></i> Print
                  </Button>
                </React.Fragment>
              )}
              {this.props.match.params.id === "new" && (
                <React.Fragment>
                  <Button variant="danger" onClick={this.handleClear}>
                    <i className="fa fa-eraser"></i> Clear
                  </Button>
                  <Button variant="primary" onClick={this.handleSave}>
                    <i className="fa fa-save"></i> Save
                  </Button>
                </React.Fragment>
              )}
            </ButtonGroup>
          </Col>
        </Row>
        <SoDetails
          options={customerOptions}
          salesOrder={salesOrder}
          onChange={this.handleChangeDetails}
          onChangeCustomer={this.handleChangeCustomer}
          onChangeDate={this.handleChangeDate}
          selectedCustomer={selectedCustomer}
          errors={errors}
        />
        <Row>
          <Col>
            <Table size="sm">
              <TableHeader
                columns={this.columns}
                sortColumn={{ path: "item", order: "asc" }}
                onSort={this.handleSort}
              />
              <TableBody
                columns={this.columns}
                data={this.state.salesOrder.soItems}
              />
            </Table>
          </Col>
        </Row>

        <SoSummary salesOrder={salesOrder} />
      </Col>
    );
  }
}

export default NewSalesOrder;
