/** @format */

import React from "react";
import _ from "lodash";
import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";

const PaginationBar = props => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;

  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <Pagination>
      {pages.map(page => (
        <Pagination.Item
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

PaginationBar.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default PaginationBar;
