import React from "react";
import "./Progress.scss";

export default function Progress({ value, indeterminate }) {
  return (
    <div className="progress">
      {indeterminate && <div className="indeterminate"></div>}
      {value && (
        <div className="determinate" style={{ width: value + "%" }}></div>
      )}
    </div>
  );
}
