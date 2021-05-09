import React, { useContext } from "react";
import "./Header.scss";

import icon from "../../assets/hero.png";
import { useGlobalContext } from "../../context/GlobalContext";

export default function Header({}) {
  const { version } = useGlobalContext();
  return (
    <div className="header">
      <img src={icon} alt="" className="logo" />
      <div className="main-heading">
        <b>NITH RESULTS</b>
        <span className="date">{new Date(version).toDateString()}</span>
      </div>
    </div>
  );
}
