
// import '../common/base'
import "../../freedom/index";
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../views/appointCourses/app';
import { Provider } from 'mobx-react';
import store from '../mobx';

ReactDOM.render(
  <Provider rootStore={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
