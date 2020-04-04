/** @format */

import React, { Component } from "react";
import Joi from "joi-browser";
import { Button } from "react-bootstrap";
import Input from "./input";
import CheckBox from "./checkBox";

class FormHelper extends Component {
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    let data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  toggleCheck = () => {
    let checked =
      this.state.data.isAdmin === "on" || this.state.data.isAdmin === true
        ? false
        : true;
    const user = { ...this.state.data };
    user.isAdmin = checked;
    this.setState({ data: user });
  };

  renderButton(label) {
    return (
      <Button disabled={this.validate()} variant="primary" type="submit">
        {label}
      </Button>
    );
  }

  renderModalButton(
    label,
    onClick,
    variant,
    validation = false,
    className = ""
  ) {
    return (
      <Button
        disabled={this.validate() && validation}
        variant={variant}
        onClick={onClick}
        className={className}
      >
        {label}
      </Button>
    );
  }

  renderInput(name, label, type = "text", ref) {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        label={label}
        name={name}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderCheck(name, label) {
    return (
      <CheckBox
        checked={this.state.data.isAdmin}
        label={label}
        name={name}
        onChange={this.toggleCheck}
      />
    );
  }
}

export default FormHelper;
