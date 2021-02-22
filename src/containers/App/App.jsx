import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Explorer from "../Explorer/Explorer";
import SingleResult from "../SingleResult/SingleResult";

import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Explorer} />
      <Route exact path="/r/:roll" component={SingleResult} />
    </BrowserRouter>
  );
}

export default App;
