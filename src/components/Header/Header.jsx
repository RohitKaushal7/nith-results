import React from "react";
import "./Header.scss";

import icon from "../../assets/snow1.png";

export default function Header({ lastUpdated }) {
  return (
    <div className="header">
      <img src={icon} alt="" className="logo" />
      <div className="main-heading">
        <b>NITH RESULTS</b>
        <span className="date">{lastUpdated}</span>
      </div>
    </div>
  );
}
