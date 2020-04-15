import React, { Component } from "react";
import { Row, Table } from "react-bootstrap";

class SoSummary extends Component {
  render() {
    const {
      vatableSales,
      vatExemptSales,
      vatAmount,
      zeroRatedSales,
      totalAmount,
    } = this.props.salesOrder;
    const currency = {
      style: "currency",
      currency: "PHP",
    };

    return (
      <Row className="justify-content-end font-weight-bold">
        <Table className="w-50" size="sm" borderless>
          <tbody>
            <tr>
              <td colSpan="2">VATable Sales</td>
              <td colSpan="2">
                {vatableSales.toLocaleString("en-US", currency)}
              </td>
            </tr>
            <tr>
              <td colSpan="2">VAT-Exempt Sales</td>
              <td colSpan="2">
                {vatExemptSales.toLocaleString("en-US", currency)}
              </td>
            </tr>
            <tr>
              <td colSpan="2">Zero-Rated Sales</td>
              <td colSpan="2">
                {zeroRatedSales.toLocaleString("en-US", currency)}
              </td>
            </tr>
            <tr>
              <td colSpan="2">VAT Amount</td>
              <td colSpan="2">{vatAmount.toLocaleString("en-US", currency)}</td>
            </tr>
            <tr>
              <td colSpan="2">
                <h5 className="font-weight-bold">Total</h5>
              </td>
              <td colSpan="2">
                <h5 className="font-weight-bold">
                  {totalAmount.toLocaleString("en-US", currency)}
                </h5>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>
    );
  }
}

export default SoSummary;
