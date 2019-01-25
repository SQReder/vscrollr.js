import React, {PureComponent} from "react";
import cx from 'classnames';
import "./row.css";

export default class Row extends PureComponent {
  render() {
    const {expanded, model, className, setRef, toggle, id} = this.props;

    return (
      <div ref={setRef} className={cx("row", className, {expanded})} data-id={id}>
        <div className="title" onClick={toggle}>
          <div className="arrow"/>
          {model.title}
        </div>
        <div className={cx("content")}>
          {model.content}
        </div>
      </div>
    )
  }
}
