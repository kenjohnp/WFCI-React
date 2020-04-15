import React, { Component } from "react";
import { Row, Col, Table } from "react-bootstrap";
import SoItem from "./soItem";

class SoItems extends Component {
  render() {
    const {
      soItems,
      onChangeItem,
      onChangeItemDetails,
      onDelete,
      itemsOptions,
    } = this.props;
    return (
      <Row>
        <Col>
          <Table size="sm" bordered>
            <thead>
              <tr>
                <th width={700}>Item Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {soItems.map((soItem, index) => (
                <SoItem
                  key={soItem.item + index}
                  index={index}
                  soItem={soItems[index]}
                  options={itemsOptions}
                  onChangeItem={(selectedItem) =>
                    onChangeItem(selectedItem, index)
                  }
                  onChangeItemDetails={(currentTarget) =>
                    onChangeItemDetails(currentTarget, index)
                  }
                  onDelete={(index) => onDelete(index)}
                  qty={soItem.qty}
                  price={soItem.price}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default SoItems;
