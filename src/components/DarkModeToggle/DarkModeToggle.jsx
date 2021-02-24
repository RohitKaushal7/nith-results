import React, { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";
import "./DarkModeToggle.scss";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useContext(GlobalContext);
  return (
    <div
      className="dark_toggle"
      onClick={() => {
        setDarkMode((d) => !d);
      }}
      title="toggle Dark Mode"
    >
      <div className="cover"></div>
    </div>
  );
}
