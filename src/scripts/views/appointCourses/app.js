import React from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import SelectSlotRow from './components/selectSlotRow';
import './app.scss';
import SwitchRow from './components/switchRow';
import ExplainRow from './components/explainRow';
import { Modal, SlotModal, Toast } from '../../components';
@inject('rootStore')
@observer
class App extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="app">
        <a href='#/login'>去login</a>
        <button onClick={() => this.props.history.push('login')}>跳转login</button>
      </div>
    )
  }
}

export default App;
