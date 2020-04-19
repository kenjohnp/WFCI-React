import React, { Component } from "react";
import { Button } from "react-bootstrap";

class ButtonGroup extends Component {
  render() {
    const { buttons, styleClass } = this.props;
    return (
      <div className={`btn-group ${styleClass}`}>
        {buttons.map((button) => (
          <Button
            variant={button.variant}
            onClick={button.onClick}
            key={button.label}
          >
            <i className={button.icon}></i>
            <span> </span>
            {button.label}
          </Button>
        ))}
      </div>
    );
  }
}

export default ButtonGroup;
