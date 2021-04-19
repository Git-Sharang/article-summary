import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Results from "./components/Results";
import "./App.css";
import ParametersForm from "./components/ParametersForm";

const App = () => (
  <BrowserRouter>
    <div className="container">
      <Switch>
        <Route component={ParametersForm} path="/" exact={true} />
        <Route component={Results} path="/results" />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
