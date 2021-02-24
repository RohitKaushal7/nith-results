import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import DarkModeToggle from "../../components/DarkModeToggle/DarkModeToggle";
import GlobalContext from "../../context/GlobalContext";
import Explorer from "../Explorer/Explorer";
import SingleResult from "../SingleResult/SingleResult";

import "./App.scss";

function App() {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("dark"))
  );
  return (
    <BrowserRouter>
      <GlobalContext.Provider value={{ darkMode, setDarkMode }}>
        <DarkModeToggle setDarkMode={setDarkMode} darkMode={darkMode} />
        <Route exact path="/" component={Explorer} />
        <Route exact path="/r/:roll" component={SingleResult} />
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
