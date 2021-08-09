import React, { useContext } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import "./DarkModeToggle.scss";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useGlobalContext();
  return (
    <div
      className="dark_toggle"
      onClick={() => {
        setDarkMode((d) => !d);
        window.gtag?.("event", "dark_mode_toggle", { to: !darkMode });
      }}
      title="toggle Dark Mode"
    >
      <div className="cover"></div>
    </div>
  );
}
