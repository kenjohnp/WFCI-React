import React from "react";
import { Row, Col, Alert, Card } from "react-bootstrap";
import NewSalesOrderHelper from "./helper/newSalesOrder";
import SoDetails from "./salesOrders/soDetails";
import SoSummary from "./salesOrders/soSummary";
import ButtonGroup from "./common/buttonGroup";
import Table from "./common/table";
import "react-datepicker/dist/react-datepicker.css";

class NewSalesOrder extends NewSalesOrderHelper {
  state = {
    customers: [],
    selectedCustomer: null,
    customerOptions: [],
    items: [],
    itemsOptions: [],
    buttonGroup: [],
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
    readOnly: false,
    isMounted: false,
  };

  componentDidMount() {
    this.setState({ isMounted: true });
    this.populateSelect();
    this.populateSalesOrder();
    this.populateButtonGroup();
    this.IsReadOnly();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleClear();
      this.populateButtonGroup();
      this.IsReadOnly();
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  IsReadOnly() {
    const readOnly = this.props.match.params.id === "new" ? false : true;
    this.setState({ readOnly });
  }

  render() {
    const {
      customerOptions,
      selectedCustomer,
      errors,
      salesOrder,
      buttonGroup,
    } = this.state;

    return (
      <Col className="mt-5">
        {Object.values(errors)[0] && (
          <Alert variant="danger">{Object.values(errors)[0]}</Alert>
        )}

        <Card body className="mb-3">
          <h4>New Sales Order</h4>
          <ButtonGroup buttons={buttonGroup} styleClass="mb-3" />
          <SoDetails
            options={customerOptions}
            salesOrder={salesOrder}
            onChange={this.handleChangeDetails}
            onChangeCustomer={this.handleChangeCustomer}
            onChangeDate={this.handleChangeDate}
            selectedCustomer={selectedCustomer}
            readOnly={this.state.readOnly}
            errors={errors}
          />
        </Card>
        <Row>
          <Col>
            <Table
              size="sm"
              columns={this.columns}
              data={this.state.salesOrder.soItems}
              onSort={this.handleSort}
              sortColumn={{ path: "item", order: "asc" }}
            />
          </Col>
        </Row>
        <SoSummary salesOrder={salesOrder} />
      </Col>
    );
  }
}

export default NewSalesOrder;
