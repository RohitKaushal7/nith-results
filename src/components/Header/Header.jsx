import React from "react";
import "./Header.scss";

export default function Header({ lastUpdated }) {
  return (
    <div className="header">
      <img src="./pics/snow1.png" alt="" className="logo" />
      <div className="main-heading">
        <b>NITH RESULTS</b>
        <span className="date">{lastUpdated}</span>
      </div>
    </div>
  );
}
