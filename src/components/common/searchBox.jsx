import React from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

const SearchBox = ({ value, onChange }) => {
  return (
    <InputGroup className="m-2 w-25">
      <Form.Control
        type="text"
        placeholder="Search..."
        value={value}
        onChange={e => onChange(e.currentTarget.value)}
      />
      <InputGroup.Append>
        <Button className="btn-outline">
          Search <i className="fa fa-search"></i>
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default SearchBox;
