import React, { useState, useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import DarkModeToggle from "../../components/DarkModeToggle/DarkModeToggle";
import GlobalContext from "../../context/GlobalContext";
import { getVersion } from "../../services/api";
import Explorer from "../Explorer/Explorer";
import SingleResult from "../SingleResult/SingleResult";

import "./App.scss";

function App() {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("dark") || "true")
  );
  const [version, setVersion] = useState(localStorage.getItem("VERSION"));

  // EFFECTS
  useEffect(() => {
    getVersion()
      .then((version) => {
        console.log("VERSION - ", version);
        setVersion(version);
      })
      .catch((err) => {
        console.log("Failed to get Version.");
      });
  }, []);
  useEffect(() => {
    // let $moon = document.querySelector(".dark_toggle");
    let $cover = document.querySelector(".dark_toggle .cover");
    if (darkMode === true) {
      localStorage.setItem("dark", true);
      document.body.classList.add("dark");
      $cover.style.width = "1.7em";
      $cover.style.height = "1.7em";
      $cover.style.background = "#111";
    } else {
      localStorage.setItem("dark", false);
      document.body.classList.remove("dark");
      $cover.style.width = "2.5em";
      $cover.style.height = "2.5em";
      $cover.style.background = "#ffd700";
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <GlobalContext.Provider
        value={{ darkMode, setDarkMode, version, setVersion }}
      >
        <DarkModeToggle setDarkMode={setDarkMode} darkMode={darkMode} />
        <Route exact path="/" component={Explorer} />
        <Route exact path="/r/:roll" component={SingleResult} />
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
