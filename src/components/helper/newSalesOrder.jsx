import React, { Component } from "react";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import Select from "react-select";
import { Form, Button } from "react-bootstrap";
import { getCustomers } from "../../services/customerService";
import { getItems } from "../../services/itemService";
import { saveSalesOrder, getSalesOrder } from "../../services/soService";

class NewSalesOrderHelper extends Component {
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
          menuIsOpen={this.state.readOnly ? false : undefined}
          isSearchable={!this.state.readOnly}
          maxMenuHeight={150}
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
          readOnly={this.state.readOnly || item.item === ""}
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
          readOnly={this.state.readOnly || item.item === ""}
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
      label: "Total Amount",
      key: "total",
      content: (item) => (
        <Form.Control value={item.price * item.qty} readOnly />
      ),
    },
    {
      key: "delete",
      content: (item) =>
        item.item !== "" &&
        this.props.match.params.id === "new" && (
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

  populateButtonGroup() {
    const buttonGroup = [];

    if (this.props.match.params.id === "new") {
      buttonGroup.push(
        {
          label: "Clear",
          onClick: this.handleClear,
          icon: "fa fa-eraser",
          variant: "outline-danger",
        },
        {
          label: "Save",
          onClick: this.handleSave,
          icon: "fa fa-save",
          variant: "primary",
        }
      );
    } else {
      buttonGroup.push(
        {
          label: "Cancel",
          onClick: this.handleClear,
          icon: "fa fa-close",
          variant: "outline-danger",
        },
        {
          label: "Modify",
          onClick: this.handleClear,
          icon: "fa fa-close",
          variant: "outline-primary",
        },
        {
          label: "Delivery Receipts",
          onClick: this.handleClear,
          icon: "fa fa-truck",
          variant: "outline-dark",
        },
        {
          label: "Sales Invoices",
          onClick: this.handleClear,
          icon: "fa fa-dollar",
          variant: "outline-dark",
        },
        {
          label: "Collections",
          onClick: this.handleClear,
          icon: "fa fa-money",
          variant: "outline-dark",
        },
        {
          label: "Print",
          onClick: this.handleClear,
          icon: "fa fa-print",
          variant: "outline-dark",
        }
      );
    }

    this.setState({ buttonGroup });
  }

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

  async populateSelect() {
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

    if (this.state.isMounted) {
      this.setState({ customers, customerOptions, items, itemsOptions });
    }
  }

  async populateSalesOrder() {
    try {
      const soId = this.props.match.params.id;
      if (soId === "new") return;

      const { data: salesOrder } = await getSalesOrder(soId);

      if (this.state.isMounted) {
        this.setState({ salesOrder: this.mapToViewModel(salesOrder) });
        this.computeTotalAmount();
      }
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

  resetIndex = () => {
    let salesOrder = this.state.salesOrder;
    for (let i = 0; i < salesOrder.soItems.length; i++)
      salesOrder.soItems[i].index = i;

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

  handleChangeCustomer = (selectedCustomer) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.name = selectedCustomer.label;
    this.setState({ selectedCustomer, salesOrder });
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

  handleChangeItem = (selectedItem, index) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems[index].item = selectedItem;

    if (salesOrder.soItems[salesOrder.soItems.length - 1].item !== "")
      this.handleAddItem();

    this.setState({ salesOrder });
  };

  handleChangeItemDetails = ({ currentTarget: input }, index) => {
    const salesOrder = this.state.salesOrder;
    salesOrder.soItems[index][input.name] = input.value;
    this.setState({ salesOrder });
    this.computeTotalAmount();
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
}

export default NewSalesOrderHelper;
