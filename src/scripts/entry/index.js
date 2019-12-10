
// import '../common/base'
import "../../freedom/index";
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../views/appointCourses/app';
import Login from '../views/login/login'
import { Provider } from 'mobx-react';
import store from '../mobx';
import { HashRouter, Route, Switch,hashHistory } from 'react-router-dom';

ReactDOM.render(
  <Provider rootStore={store}>
    <HashRouter history={hashHistory}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </HashRouter>
  </Provider>
  ,
  document.getElementById('app')
);
