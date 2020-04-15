import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import Select from "react-select";

class SoItem extends Component {
  render() {
    const {
      options,
      soItem,
      onChangeItem,
      onChangeItemDetails,
      onChange,
      index,
      onDelete,
    } = this.props;
    return (
      <tr>
        <td>
          <Select
            options={options}
            value={soItem.item}
            onChange={onChangeItem}
          />
        </td>
        <td>
          <Form.Control
            type="number"
            min="0"
            name="qty"
            id={index}
            value={soItem.qty}
            onChange={onChangeItemDetails}
          ></Form.Control>
        </td>
        <td>
          <Form.Control
            type="number"
            min="0"
            name="price"
            id={index}
            value={soItem.price}
            onChange={onChangeItemDetails}
          ></Form.Control>
        </td>
        <td>
          <Form.Control
            value={soItem.price * soItem.qty}
            readOnly
          ></Form.Control>
        </td>
        <td>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default SoItem;
