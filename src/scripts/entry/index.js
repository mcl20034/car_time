
// import '../common/base'
import "../../freedom/index";
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import App from '../views/appointCourses/app';
// import Download from '../views/appointCourses/containers/download/download';
import { Provider } from 'mobx-react';
import store from '../mobx';

ReactDOM.render(
  <Provider rootStore={store}>
    <App />
    {/* <Router history={browserHistory}>
        <Route path="/" component={ App }>
            <IndexRoute component={ App }/>
        </Route>
    </Router> */}
  </Provider>,
  document.getElementById('app')
);
