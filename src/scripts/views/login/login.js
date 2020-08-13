import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './login.scss';
import Service from '../../services/coursesService';
const service = new Service();
import axios from 'axios';
import apiConf from '../../config/api';
import { Toast } from '../../components';

import md5 from 'md5';
@inject('rootStore')
@observer
class Login extends React.Component {
  @observable time = 1;
  @observable imgcode = '';
  @observable username = '';
  @observable userpwd = '';
  @observable usercode = '';
  @observable cookie = '';
  constructor(props) {
    super(props);
    let adaptor = {
      dev: '', // 开发环境接口地址
      prod: '' // 上线环境接口地址
    };
    // console.log(`环境是${process.env.NODE_ENV}`);
    this._domain = adaptor[process.env.NODE_ENV];
    this.data = null
  }
  componentDidMount() {
    this.getData('ValidateImageServlet', {}, 'get');
  }

  getData = (urlKey, data, method = 'post', showErr = true) => {
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
        _this.cookie = res.headers['mobile-cookie'];
        // console.log('console log to chrome res', res);
        // const base64 = new ArrayBuffer(res.data).toString('base64');
        // this.imgcode = `data:image/png;base64,${base64}`
        _this.imgcode = res.data
        resolve();
      }).catch(err => {
        reject();
      })
    });
  }

  arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);  //base64
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

  login = () => {
    localStorage.setItem("isLogin","login");
    Toast.info('登录成功', 1200);
    this.props.history.push('/')
  }

  render() {
    let img = '';
    if (this.imgcode) {
      img = this.arrayBufferToBase64(this.imgcode);
    }
    return (
      <div className='login'>
        <img className='login-img' />
        <div className='login-child'>
          <input
            onInput={(e) => {
              this.username = e.target.value
            }}
            style={{ width: '90%' }}
            type='text'
            placeholder='手机号'
            className='login-child-input'
          />
          <input
            onInput={(e) => {
              this.userpwd = e.target.value
            }}
            className='login-child-password'
            placeholder="请输入您的密码"
            type='password'
          />
          <div className='login-child-div'>

          </div>
          <div onClick={() => { this.login() }} className='login-child-button'>
            <img />
            <span>登录</span>
          </div>

        </div>
      </div>
    )
  }
}

export default Login;
