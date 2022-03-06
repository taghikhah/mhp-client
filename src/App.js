import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navBar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Messages from "./components/messages";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar />
        <main className="container">
          <Switch>
            {/* 
            <Route path="/movie/:id" component={MovieForm} />
            <Route path="/movies" component={Movies} /> */}
            <Route path="/messages" component={Messages} />
            <Redirect from="/" exact to="/messages" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
