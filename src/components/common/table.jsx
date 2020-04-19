import React, { Component } from "react";
import { Table as TableWrapper } from "react-bootstrap";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

class Table extends Component {
  render() {
    const { columns, data, sortColumn, onSort, size } = this.props;
    return (
      <TableWrapper size={size}>
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody columns={columns} data={data} />
      </TableWrapper>
    );
  }
}

export default Table;
