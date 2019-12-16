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
import Service from '../../services/coursesService';
const service = new Service();
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
    this.getDate
    let u = navigator.userAgent
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
    this.getData();
  }

  getData = () => {
    service.fullperiod({
      step: 60,
      symbol: this.getCurrentId()
    }).then((res) => {
      console.log('console log to chrome res', res);
      this.getOption(res)
      this.money = res[res.length - 1][4]
    }).catch((err) => {
      console.log('console log to chrome err', err);
    });
  }

  getCurrentId = () => {
    let id = ''
    for (let i = 0; i < CURRENCT_TYPE.length; i++) {
      if (this.state.currencyType === CURRENCT_TYPE[i].name) {
        id = CURRENCT_TYPE[i].id;
      }
    }
    return id;
  }


  getOption = (res) => {
    let data = [];
    let date = [];
    let year = new Date().getFullYear() + '.';
    let month = new Date().getMonth() + 1 + '.';
    let day = new Date().getDate();
    let hours = new Date().getHours()
    let minutes = new Date().getMinutes()
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
    for (let i = 1; i < res.length; i++) {
      data.push(res[i][4])
    }
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
          name: '数据',
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
    this.option = option
  }

  changeType = (type) => {
    this.setState({
      currencyType: type,
    }, () => {
      this.getData();
    })
  }
  colseBottomDown = () => {
    this.setState({
      bottomDownShow: false
    })
  }
  render() {
    let { location } = this.props;
    let params = '';
    if (location.search) {
      let search = location.search;
      search = search.replace('?', '');
      let searchs = search.split('&');
      for (let index = 0; index < searchs.length; index++) {
        let childs = searchs[index].split('=');
        if (Array.isArray(childs) && childs.length > 1) {
          if (childs[0] === 'uid') {
            params = childs[1]
          }
        }
      }
    }
    const { currencyType, bottomDownShow, IOSOrAndroid } = this.state
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
                      return (
                        <li className={`${currencyType == type.name ? 'active' : ''}`} onClick={this.changeType.bind(this, type.name)}>
                          {type.name}
                        </li>
                      )
                    })
                  }
                </ul>
                <div className='chart-box'>
                  <h1>1{currencyType} = <span>￥</span>{this.money}</h1>
                  <div style={{ height: '100%' }}>
                    <ReactEcharts option={this.option} style={{ height: '100%' }} />
                  </div>
                </div>
              </div>
              <div className='main_btn'>
                <Link to="/login">
                  <div className='border-btn'>登录</div>
                </Link>
                <Link to={params ? `/register?uid=${params}` : "/register"}>
                  <div className='regist' >注册</div>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className='module_title module_dif'>我们的优势</div>
            <div className='module_border' />
            <div className='module_main_two'>
              <li>
                <div><img className='img-team' /></div>
                <p>专业团队</p>
                <span>集合全行业顶尖人才</span>
              </li>
              <li>
                <div><img className='img-lock' /></div>
                <p>安全风控</p>
                <span>世界最顶级的金融级安全方案</span>
              </li>
              <li>
                <div><img className='img-ellipse' /></div>
                <p>高效撮合</p>
                <span>高性能撮合引擎</span>
              </li>
              <li>
                <div><img className='img-currency' /></div>
                <p>优质币种</p>
                <span>严格的评选机制筛选出行业内最优质的币种</span>
              </li>
              <li>
                <div><img className='img-public' /></div>
                <p>公开透明</p>
                <span>根据平台的透明机制，时时公示最新的资产分配</span>
              </li>
              <li>
                <div><img className='img-share'/></div>
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
                    <span><img  className='img-android'/></span>
                    安卓下载
                  </div>
                </Link>
                <Link to={{
                  pathname: '/download',
                  search: 'type=IOS'
                }}>
                  <div className='border-btn'>
                    <span><img className='img-ios' /></span>
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
