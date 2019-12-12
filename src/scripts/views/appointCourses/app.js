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
      IOSOrAndroid: '',

    };
  }
  componentDidMount() {
    // this.getOption()
    let u = navigator.userAgent
    console.log('console log for chrom u -=-==-=-', u);
    let android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或uc浏览器
    let iPhone = u.indexOf('iPhone') > -1 //是否为iPhone或者QQHD浏览器
    let iPad = u.indexOf('iPad') > -1 //是否iPad
    if (android) {
      this.setState({
        IOSOrAndroid: 'Android'
      })
    }
    if (iPhone || iPad) {
      this.setState({
        IOSOrAndroid: 'IOS'
      })
    }
  }

  componentWillMount() {
  }
  getOption = () => {
    const { currencyType } = this.state
    // var base = +new Date(1968, 9, 3);
    // var oneDay = 24 * 3600 * 1000;
    // var date = [];

    // var data = [Math.random() * 300];

    // for (var i = 1; i < 20000; i++) {
    //     var now = new Date(base += oneDay);
    //     date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    //     data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
    // }
    // console.log('console log for chrom date', date);
    // console.log('console log for chrom data', data);


    let data = [];
    let date = [];
    let year = new Date().getFullYear() + '.';
    let month = new Date().getMonth() + 1 + '.';
    let day = new Date().getDate();
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
    console.log('console log for chrom hours', hours);
    for (let i = 0; i < 5; i++) {
      let j = i == 0 ? minutes : 60
      for (j; j >= 0; j--) {
        if (j < 10) {
          date.push(`${hours - i} : 0${j}`)
        } else {
          date.push(`${hours - i} : ${j}`)
        }
      }
    }
    date = date.reverse()
    console.log('console log for chrom date', date);
    for (let i = 1; i < 280; i++) {
      data.push(((Math.random()+1) * 2000).toFixed(2))
    }
    console.log('console log for chrom data', data);
    let option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '100%'];
        }
      },
      title: {
        // left: 'left',
        text: '   ',
        subtext: `      ${year}${month}${day}`
    },
      xAxis: {
        type: 'category',
        data: date,
        axisLabel: {
          color: '#FFF',
          interval: 60
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(112,130,179,1)',
            width: 1
          },
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        show: false
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 1000
      }
      ],
      series: [
        {
          name: '模拟数据',
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            color: '#5C72AE',
          },
          lineStyle: {
            color: '#5C72AE',
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#5C72AE'
            }, {
              offset: 1,
              color: 'rgba(14,30,72,0)'
            }])
          },
        }
      ]
    };
    return option
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
    const { currencyType, bottomDownShow, IOSOrAndroid } = this.state
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
                    <h1>1{currencyType} = <span>￥</span>{535345.3}</h1>
                    <div style={{height:'100%'}}>
                    <ReactEcharts option={this.getOption()} style={{height:'120%'}}/>
                    </div>
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
            <div className='module_title module_dif'>我们的优势</div>
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
          <div className='footer' style={bottomDownShow ? {} : { paddingBottom: 0 }}>
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
            <Link to={{
              pathname: '/download',
              search: `type=${IOSOrAndroid}`
            }}>
              <div className='btn' >
                下载APP
            </div>
            </Link>
          </div>
        }
      </div>
    )
  }
}

export default App;
