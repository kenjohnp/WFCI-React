/** @format */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return (item._id || item.value + item.index) + (column.path || column.key);
  };

  handleClick = (item) => {
    if (this.props.clickable)
      this.props.history.push(`${this.props.clickableTo}${item._id}`);
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr
            key={item._id || item.index}
            onClick={() => this.handleClick(item)}
          >
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
