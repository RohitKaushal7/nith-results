import React, { useContext } from "react";
import "./Header.scss";

import icon from "../../assets/hero.png";
import { useGlobalContext } from "../../context/GlobalContext";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export default function Header({}) {
  const { version } = useGlobalContext();
  return (
    <div className="header">
      <img src={icon} alt="" className="logo" />
      <div className="main-heading">
        <h2>NITH RESULTS</h2>
        <div className="date">
          {months[new Date(version).getMonth()]}{" "}
          {new Date(version).getFullYear()}
        </div>
      </div>
    </div>
  );
}
