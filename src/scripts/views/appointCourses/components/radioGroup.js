import React, { PureComponent, Component } from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import ExplainItem from "./explainItem";
import "../app.scss";
import _ from "lodash";

class RadioGroup extends React.Component {
  getRadioComponent(item, index) {
    return (
      <div className="custom-radio" key={this.props.name + "-" + index}>
        <input
          id={item.id}
          type="radio"
          name={this.props.name}
          value={item.value}
          checked={this.props.checkedValue == item.value}
          disabled={item.disabled}
          onChange={this.props.checkChanged}
        />
        <label htmlFor={item.id} disabled={item.disabled}>
          {item.text}
        </label>
      </div>
    );
  }

  render() {
    let className = this.props.isHorizontal ? "horizontal" : "normal",
      items = this.props.items || [];
    return (
      <div id={this.props.id} className={className}>
        {items.map((item, index) => {
          if (this.props.isHorizontal)
            return this.getRadioComponent(item, index);
          else
            return <div key={index}>{this.getRadioComponent(item, index)}</div>;
        })}
      </div>
    );
  }
}

export default RadioGroup;
