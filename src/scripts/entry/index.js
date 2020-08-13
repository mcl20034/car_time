// import '../common/base'
import "../../freedom/index";
import React from "react";
import ReactDOM from "react-dom";
import App from "../views/appointCourses/app";
import Empty from "../views/appointCourses/empty";

import Login from "../views/login/login";
import Register from "../views/register/register";
import Download from "../views/download/download";
import Company from "../views/company/company";
import Brand from "../views/brand/brand";
import Gdmap from "../views/gdmap/gdmap";

import { Provider } from "mobx-react";
import store from "../mobx";
import {
  HashRouter,
  Route,
  Switch,
  hashHistory,
  Redirect,
} from "react-router-dom";

ReactDOM.render(
  <Provider rootStore={store}>
    <HashRouter history={hashHistory}>
      <Switch>
        <Route exact path="/" component={Empty} />
        <Route exact path="/company" component={Company} />
        <Route exact path="/brand" component={Brand} />
        <Route exact path="/gdmap" component={Gdmap} />
        <Route exact path="/home/:id" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/download" component={Download} />
        <Redirect to="/" />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById("app")
);
