import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject, useLocalStore } from 'mobx-react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SelectSlotRow from './components/selectSlotRow';
import './app.scss';
import SwitchRow from './components/switchRow';
import ExplainRow from './components/explainRow';
import { Modal, SlotModal, Toast } from '../../components';
import { forEach, get } from 'lodash';
import Service from '../../services/coursesService';
const service = new Service();
import getData from './data';
import getDataLogin from './datalogin';

// import { Card } from 'antd';
// import echartTheme from './../themeLight'
//不是按需加载的话文件太大
// import echarts from 'echarts'
//下面是按需加载
import echarts from 'echarts/lib/echarts'
//导入折线图
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';

const CURRENCT_TYPE = [
  {
    id: '44',
    name: 'BTC'
  },
  {
    id: '45',
    name: 'ETH'
  },
  {
    id: '58',
    name: 'LTC'
  }
]
@inject('rootStore')
@observer
class App extends React.Component {
  @observable option = {};
  @observable money = 0;
  @observable indexInfoPrices = null;
  constructor(props) {
    super(props);
  }

  

  render() {
    console.log('console log to chrome getQueryVariable',);
    let login = localStorage.getItem("isLogin");
    let list = getData();
    if (login === 'login') {
      list = getDataLogin();
    }
    let paramsd = get(this.props,'match.params.id','page1');
    list = get(list,paramsd,'page1');
    let itemList = [];
    forEach(list, (item, index) => {
      let childList = [];
      forEach(item.content, (child, i) => {
        childList.push(
          <div key={i + 'w'} className="app-item2">{child}</div>
        );
      });
      itemList.push(
        <div key={index + 'n'} className="app-item">
          <img className={item.images}></img>
          <div>
            <div className="app-item1">{item.title}</div>
            {childList}
          </div>
        </div>
      );
    });


    let buttonList = [];
    let buttonDatas = [
      { img: 'child-button1', name: '黄手环' },
      { img: 'child-button2', name: '实有人口登记' },
      { img: 'child-button3', name: '签订治安责任书' },
      { img: 'child-button4', name: '出租屋登记' },
      { img: 'child-button5', name: '平安网约房租客登记' },
    ];
    forEach(buttonDatas, (item, index) => {
      buttonList.push(
        <div key={'cc' + index} className='app-fuwu-item'>
          <img className={item.img}></img>
          <span>{item.name}</span>
        </div>
      );
    });
    return (
      <div className="app">
        <div className="app-top">
          <span onClick={() => {
            this.props.history.push('/login')
          }}>登录</span>
        </div>
        <div className="app-div">
          <div className="app-title">
            <img></img>
            <span>单县公安局</span>
          </div>
          {itemList}
        </div>
        <div className='app-shoucang'>
          <div className='app-left-button'>
            点击收藏
            </div>
          <div className='app-right-button'>
            收藏夹
            </div>
        </div>
        <img className='app-ditu'></img>
        <div className='app-fuwu-title'>
          <span>自助服务</span>
        </div>
        <div className='app-fuwu'>
          {buttonList}
        </div>
        <div className='bottom-button'>
          一键报警
        </div>
      </div>
    )
  }
}

export default App;
