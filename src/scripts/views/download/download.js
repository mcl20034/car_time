import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './download.scss';
import { InputItem } from 'antd-mobile';
import Team from '../../images/down_team.png'
import Ellipse from '../../images/down_ellipse.png'
import Currency from '../../images/down_currency.png'
import Public from '../../images/down_public.png'
import Android from '../../images/android.png'
import IOS from '../../images/ios.png'

const MAIN_LIST = [
  {
    id: 'team',
    title: '专业团队',
    context: '集合全行业顶尖人才',
    imageUrl: Team,
  },
  {
    id: 'currency',
    title: '优质币种',
    context: '严格的评选机制筛选出行业内最优质的币种',
    imageUrl: Currency,
  },
  {
    id: 'public',
    title: '公开透明',
    context: '根据平台的透明机制，时时公示最新的资产分配',
    imageUrl: Public,
  },
  {
    id: 'ellipse',
    title: '高效撮合',
    context: '高性能撮合引擎',
    imageUrl: Ellipse,
  }
]
@inject('rootStore')
@observer
class Download extends React.Component {
  @observable time = 1;
  constructor(props) {
    super(props);
    this.state = {
      maskShow: false,
      url: ''
    }
  }
  componentDidMount() {
    //获取约课数据
  }
  downloadApp = (type) => {
    console.log('console log for chrom type', type);
    var u = navigator.userAgent;
    // console.log('console log for chrom u -=-==-=-', u);
    let wx = u.indexOf('MicroMessenger') > -1
    let android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //android终端或uc浏览器
    let iPhone = u.indexOf('iPhone') > -1 //是否为iPhone或者QQHD浏览器
    let iPad = u.indexOf('iPad') > -1 //是否iPad
    if (wx) {
      //在微信中打开
      this.setState({
        maskShow: true
      })
    } else if (android) {
      this.setState({
        url: 'https://tftc-otc.oss-cn-hongkong.aliyuncs.com/hk/upload/chuangshi/app/app-yingyongbao-release.apk'
      })
      //在安卓浏览器打开
      console.log('android-browser');
    }
    if (iPhone || iPad) {
      //在IOS浏览器打开
      this.setState({
        url: 'https://tftc-otc.oss-cn-hongkong.aliyuncs.com/hk/upload/chuangshi/app/px362_YOAEX_Ch.ipa'
      })
      console.log('ios-browser');
    }
  }

  render() {
    const { maskShow, url } = this.state
    let search = this.props.location && this.props.location.search || ''
    let type = search && search.split('=')[1] || ''
    return (
      <div className='down-box'>
        <img className='box-bg' />
        <div className='header'>
          <div className='box-tit'>
            <p>全新的数字资产交易平台</p>
            <div>
              <span>安全</span>
              <span>可靠</span>
              <span>稳定</span>
            </div>
          </div>
        </div>
        <div className='main-list'>
          {
            MAIN_LIST.map(data => {
              return <div className='list'>
                <div className='icon'><img src={data.imageUrl} /></div>
                <div className='context'>
                  <p>{data.title}</p>
                  <span>{data.context}</span>
                </div>
              </div>
            })
          }
        </div>
        <div className='bottom'>
          {
            type == 'IOS' ?
              <a href={url} >
                <div className='bottom-btn' onClick={this.downloadApp.bind(null, 'IOS')}>
                  <span><img src={IOS} /></span>
                  IOS下载
                </div>
              </a> :
              <a href={url}>
                <div className='bottom-btn' onClick={this.downloadApp.bind(null, 'Android')}>
                  <span><img src={Android} /></span>
                  安卓下载
                </div>
              </a>
          }
        </div>
        {maskShow && <div className='mask-box'><img /></div>}
      </div>
    )
  }
}

export default Download;
