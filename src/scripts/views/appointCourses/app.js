import React from 'react';
import { observable } from "mobx";
import { observer, inject, useLocalStore } from 'mobx-react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SelectSlotRow from './components/selectSlotRow';
import './app.scss';
import SwitchRow from './components/switchRow';
import ExplainRow from './components/explainRow';
import { Modal, SlotModal, Toast } from '../../components';
import Lock from '../../images/lock.png'
import Team from '../../images/team.png'
import Ellipse from '../../images/ellipse.png'
import Currency from '../../images/currency.png'
import Share from '../../images/share.png'
import Public from '../../images/public.png'
import Android from '../../images/android.png'
import IOS from '../../images/ios.png'

const CURRENCT_TYPE = [
  {
    id: 'BTC',
    name: 'BTC'
  },
  {
    id: 'ETH',
    name: 'ETH'
  },
  {
    id: 'BHU',
    name: 'BHU'
  }
]
@inject('rootStore')
@observer
class App extends React.Component {
  @observable time = 1;
  constructor(props) {
    super(props);
    this.state = {
      currencyType: 'BTC',
      bottomDownShow: true,
    };
  }
  componentDidMount() {

  }

  changeType = (type) => {
    console.log('console log for chrom type', type);
    this.setState({
      currencyType: type,
    })
  }
  toLogin = () => {
    this.props.histroy
  }
  colseBottomDown = () => {
    this.setState({
      bottomDownShow: false
    })
  }
  render() {
    const { currencyType, bottomDownShow } = this.state
    console.log('console log for chrom currencyType', currencyType);
    return (
      <div className="app">
        <div >
          <div className="logo">
            <img />
          </div>
          <div>
            <div className='module_title'>全新的数字资产交易平台</div>
            <div className='module_border' />
            <div>
              <div className='main_chart'>
                <ul>
                  {
                    CURRENCT_TYPE.map(type => {
                      console.log('console log for chrom type', type);
                      return (
                        <li className={`${currencyType == type.id ? 'active' : ''}`} onClick={this.changeType.bind(this, type.id)}>
                          {type.name}
                        </li>
                      )
                    })
                  }
                </ul>
                <div className='chart-box'>
                  图表
                </div>
              </div>
              <div className='main_btn'>
                <Link to="/login">
                  <div className='border-btn' onClick={this.toLogin}>登录</div>
                </Link>
                <div className='regist'>注册</div>
              </div>
            </div>
          </div>
          <div>
            <div className='module_title'>我们的优势</div>
            <div className='module_border' />
            <div className='module_main_two'>
              <li>
                <div><img src={Team} /></div>
                <p>专业团队</p>
                <span>集合全行业顶尖人才</span>
              </li>
              <li>
                <div><img src={Lock} /></div>
                <p>安全风控</p>
                <span>世界最顶级的金融级安全方案</span>
              </li>
              <li>
                <div><img src={Ellipse} /></div>
                <p>高效撮合</p>
                <span>高性能撮合引擎</span>
              </li>
              <li>
                <div><img src={Currency} /></div>
                <p>优质币种</p>
                <span>严格的评选机制筛选出行业内最优质的币种</span>
              </li>
              <li>
                <div><img src={Public} /></div>
                <p>公开透明</p>
                <span>根据平台的透明机制，时时公示最新的资产分配</span>
              </li>
              <li>
                <div><img src={Share} /></div>
                <p>共享自制</p>
                <span>节点联盟铸造共享收益的自治组织</span>
              </li>
            </div>
          </div>
          <div>
            <div className='module_title'>下载移动端进行交易</div>
            <div className='module_border' />
            <div className='module_main_three'>
              <div className='main_btn'>
                <Link to={
                  {
                    pathname: '/download',
                    search: 'type=Android'
                  }
                }>
                  <div className='border-btn'>
                    <span><img src={Android} /></span>
                    安卓下载
                  </div>
                </Link>
                <Link to={{
                  pathname: '/download',
                  search: 'type=IOS'
                }}>
                  <div className='border-btn'>
                    <span><img src={IOS} /></span>
                    IOS下载
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className='footer' style={bottomDownShow ? {} :{paddingBottom:0}}>
            <span>©2015-2019 byou89.com. All Rights Reserved</span>
            <span className='btn'>语言</span>
          </div>
        </div>
        {
          bottomDownShow && <div className='bottom-down'>
            <span style={{ position: 'absolute', right: 10, top: 10 }} onClick={this.colseBottomDown}>X</span>
            <div className='app_logo'><img /></div>
            <div className='text'>
              <p>币U</p>
              <span>下载移动端进行交易</span>
            </div>
            <div className='btn'>
              下载APP
            </div>
          </div>
        }
      </div>
    )
  }
}

export default App;
