import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './login.scss';
import { InputItem } from 'antd-mobile';
import Service from '../../services/coursesService';
const service = new Service();
import axios from 'axios';
import apiConf from '../../config/api';
import md5 from 'md5';
@inject('rootStore')
@observer
class Login extends React.Component {
  @observable time = 1;
  @observable imgcode = '';
  constructor(props) {
    super(props);
    let adaptor = {
      dev: '', // 开发环境接口地址
      prod: '//appkidi.51talk.com' // 上线环境接口地址
    };
    // console.log(`环境是${process.env.NODE_ENV}`);
    this._domain = adaptor[process.env.NODE_ENV];
  }
  componentDidMount() {
    // console.log('console log to chrome md5',md5('w9w9w9w9'));
    // service.login({
    //   loginName:'15147088209',
    //   password:'w9w9w9w9'
    // }).then((res) => {
    //   console.log('console log to chrome res', res);

    // }).catch((err) => {
    //   console.log('console log to chrome err', err);
    // });
    //获取约课数据
    // service.ValidateImageServlet().then((res) => {
    //   // console.log('console log to chrome res', res);
    //   this.imgcode = res
    // }).catch((err) => {
    //   console.log('console log to chrome err', err);
    // });
    this.getData('ValidateImageServlet',{},'get');
  }

  async getData(urlKey, data, method = 'post', showErr = true) {
    let _this = this;
    // console.log('请求url', _this.getRequestApiUrl(urlKey));
    return new Promise(function (resolve, reject) {
      axios({
        method: method,
        headers: {
          'X-Requested-Width': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        url: _this.getRequestApiUrl(urlKey),
        responseType: 'arraybuffer'
      }).then(res => {
        console.log('console log to chrome res',res.headers);
        resolve();
      }).catch(err => {
        reject();
      })
    });
  }

  getRequestApiUrl(urlKey) {
    //简单正则，判断是否是完整的url，如果是完整的url，则直接返回
    let regExp = /^https:\/\/([^/]+)\//gi;
    if (regExp.test(urlKey)) {
      return urlKey;
    } else {
      return `${this._domain}/${apiConf[urlKey]}`;
    }
  }


  render() {
    return (
      <div className='login'>
        <img className='login-img' />
        <img className='login-logo' />
        <div className='login-child'>
          <div className='login-child-title'>欢迎登录币U</div>
          <input
            style={{ width: '90%' }}
            type='text'
            placeholder='手机号/邮箱'
            className='login-child-input'
          />
          <input
            className='login-child-password'
            placeholder="请输入您的密码"
            type='password'
          />
          <div className='login-child-button'>
            <img />
            <span>立即登录</span>
          </div>
          <div className='login-child-row'>
            <span className='login-child-forgat'>忘记密码?</span>
            <Link to='/register'>
              <span className='login-child-resig'>注册账号</span>
            </Link>
          </div>
          <img src={this.imgcode}></img>
        </div>
      </div>
    )
  }
}

export default Login;
