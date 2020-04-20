import React, { Component } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Form, Col, Row } from "react-bootstrap";

class SoDetails extends Component {
  render() {
    const {
      options,
      selectedCustomer,
      onChangeCustomer,
      salesOrder,
      onChangeDate,
      onChange,
      readOnly,
    } = this.props;

    return (
      <Row>
        <Col>
          <Form>
            <Form.Row>
              <Form.Group as={Col} md="9">
                <Form.Label>Customer</Form.Label>
                <Select
                  options={options}
                  value={selectedCustomer}
                  onChange={onChangeCustomer}
                  menuIsOpen={readOnly ? false : undefined}
                  isSearchable={!readOnly}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="3">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  className="form-control"
                  selected={salesOrder.date}
                  onChange={onChangeDate}
                  readOnly={readOnly}
                />
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>SO Reference No.</Form.Label>
                <Form.Control
                  onChange={onChange}
                  value={salesOrder.soRefNo}
                  name="soRefNo"
                  readOnly={readOnly}
                  autoComplete={"off"}
                ></Form.Control>
              </Form.Group>
              <Form.Group as={Col} md="3">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  onChange={onChange}
                  value={salesOrder.remarks}
                  name="remarks"
                  readOnly={readOnly}
                  autoComplete={"off"}
                ></Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default SoDetails;
