import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Col, Card, Form, Button } from "react-bootstrap";
import ButtonGroup from "./common/buttonGroup";
import Table from "./common/table";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ToggleSwitch from "react-toggle-switch";
import {
  getSO,
  getSOItems,
  getCancelToken,
  isCancel,
} from "../services/drService";

function NewDeliveryReceipt({ match }) {
  const [buttonGroup, setButtonGroup] = useState([]);
  const [customersOptions, setCustomersOptions] = useState([]);
  const [itemsOptions, setItemsOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [toggleItems, setToggleItems] = useState(false);
  const [deliveryReceipt, setDeliveryReceipt] = useState({
    drDate: new Date(),
    remarks: "",
    drRefNo: "",
    customerId: "",
    drItems: [],
  });

  const source = getCancelToken().source();

  useEffect(() => {
    populateCustomersOptions();
    populateButtonGroup();
    return () => {
      source.cancel("Request Cancelled");
    };
  }, []);

  const populateCustomersOptions = async () => {
    try {
      const { data } = await getSO("getCustomers", source.token);
      const result = data.map((c) => ({
        label: `${c.customer.name} (SO#${c.soRefNo})`,
        value: c._id,
      }));
      setCustomersOptions(result);
    } catch (ex) {
      if (isCancel(ex)) toast.error(ex);
    }
  };

  const populateDrItems = async (id) => {
    try {
      const { data } = await getSOItems(id, "getSOItems", source.token);
      mapDrItems(data);
    } catch (ex) {
      if (isCancel(ex)) console.log(ex);
    }
  };

  const resetIndex = (dr) => {
    for (let i = 0; i < dr.drItems.length; i++) dr.drItems[i].index = i;
    setDeliveryReceipt(dr);
  };

  const mapDrItems = async (data) => {
    const dr = { ...deliveryReceipt };
    dr.drItems = data.soItems;
    for (let item of dr.drItems) item.enabled = true;

    resetIndex(dr);
    setDeliveryReceipt(dr);

    const items = [...data.soItems];
    const itemsOptions = items.map((i) => ({
      label: i.item.label,
      value: i.item.value,
    }));

    setItemsOptions(itemsOptions);
  };

  const populateButtonGroup = () => {
    const buttonGroup = [];

    if (match.params.id === "new") {
      buttonGroup.push(
        {
          label: "Clear",
          onClick: handleClear,
          icon: "fa fa-eraser",
          variant: "outline-danger",
        },
        {
          label: "Save",
          onClick: handleSave,
          icon: "fa fa-save",
          variant: "primary",
        }
      );
    } else {
      buttonGroup.push(
        {
          label: "Cancel",
          onClick: handleClear,
          icon: "fa fa-close",
          variant: "outline-danger",
        },
        {
          label: "Modify",
          onClick: handleClear,
          icon: "fa fa-close",
          variant: "outline-primary",
        },
        {
          label: "Delivery Receipts",
          onClick: handleClear,
          icon: "fa fa-truck",
          variant: "outline-dark",
        },
        {
          label: "Sales Invoices",
          onClick: handleClear,
          icon: "fa fa-dollar",
          variant: "outline-dark",
        },
        {
          label: "Collections",
          onClick: handleClear,
          icon: "fa fa-money",
          variant: "outline-dark",
        },
        {
          label: "Print",
          onClick: handleClear,
          icon: "fa fa-print",
          variant: "outline-dark",
        }
      );
    }

    setButtonGroup(buttonGroup);
  };

  const columns = [
    {
      key: "check",
      label: (
        <ToggleSwitch on={toggleItems} onClick={() => handleToggleSwitch()} />
      ),
      content: (item) => (
        <ToggleSwitch
          on={item.enabled}
          onClick={() => handleToggleSwitch(item.index)}
        />
      ),
    },
    {
      path: "deliveryReceipt.drItems.item",
      label: "Item Name",
      width: "600px",
      content: (item) => <span>{item.item.label}</span>,
    },
    {
      path: "deliveryReceipt.drItems.qty",
      label: "Qty",
      width: "120px",
      content: (item) => (
        <Form.Control
          type={"number"}
          max={item.qty}
          value={item.qty}
          onChange={handleChangeInput}
        />
      ),
    },
  ];

  const handleClear = () => {};

  const handleSave = () => {};

  const handleChangeCustomer = (selected) => {
    const dr = { ...deliveryReceipt };
    dr.customerId = selected.value;
    populateDrItems(selected.value);
    setDeliveryReceipt(dr);
    setSelectedCustomer(selected);
  };

  const handleChangeDate = (date) => {
    const dr = { ...deliveryReceipt };
    dr.drDate = date;
    setDeliveryReceipt(dr);
  };

  const handleChangeInput = ({ currentTarget: input }) => {
    const dr = { ...deliveryReceipt };
    dr[input.name] = input.value;
    setDeliveryReceipt(dr);
  };

  const handleToggleSwitch = (index = "all") => {
    const dr = { ...deliveryReceipt };

    if (index === "all") {
      for (let item of dr.drItems) item.enabled = !toggleItems;
      setToggleItems(!toggleItems);
    } else {
      dr.drItems[index].enabled = !dr.drItems[index].enabled;
      setDeliveryReceipt(dr);
    }
  };

  const handleChangeItem = () => {};

  const handleChangeItemDetails = ({ currentTarget: input }, index) => {};

  const handleSort = () => {};

  return (
    <Col className="mt-5">
      <Card body>
        <h4>New Delivery Receipt</h4>
        <ButtonGroup buttons={buttonGroup} styleClass="mb-3" />
        <Form>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Customer</Form.Label>
                <Select
                  options={customersOptions}
                  value={selectedCustomer}
                  onChange={(selected) => handleChangeCustomer(selected)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <DatePicker
                  className="form-control"
                  selected={deliveryReceipt.drDate}
                  onChange={handleChangeDate}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>DR Ref No</Form.Label>
                <Form.Control
                  value={deliveryReceipt.drRefNo}
                  onChange={handleChangeInput}
                  name="drRefNo"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  value={deliveryReceipt.remarks}
                  onChange={handleChangeInput}
                  name="remarks"
                />
              </Form.Group>
            </Col>
          </Form.Row>
        </Form>
      </Card>
      <Table
        size={"sm"}
        columns={columns}
        sortColumn={{ path: "item", order: "asc" }}
        onSort={handleSort}
        data={deliveryReceipt.drItems}
      />
    </Col>
  );
}

export default NewDeliveryReceipt;
