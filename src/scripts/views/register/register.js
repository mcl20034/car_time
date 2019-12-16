import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './register.scss';

import Service from '../../services/coursesService';
const service = new Service();
import axios from 'axios';
import apiConf from '../../config/api';
import { Toast } from '../../components';
import md5 from 'md5';

@inject('rootStore')
@observer
class Login extends React.Component {
  @observable imgcode = '';
  @observable userphone = '';
  @observable useremail = '';
  @observable userpwd = '';
  @observable usercode = '';
  @observable cookie = '';
  @observable userimgcode = '';
  @observable userincode = '';
  constructor(props) {
    super(props);
    this.state = {
      regType: 'phone_num',
      phone: '',
    }
    let adaptor = {
      dev: '', // 开发环境接口地址
      prod: '//appkidi.51talk.com' // 上线环境接口地址
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

  changeRegType = (type) => {
    this.setState({
      regType: type
    })
  }
  changePhone = (value) => {
    return this.setState({
      phone: value
    })
  }

  getCode = () => {
    const { regType } = this.state
    if (regType == 'phone_num') {
      this.getPhoneCode();
    } else {
      this.getEmailCode();
    }
  }

  getPhoneCode = () => {
    if (!this.userphone) {
      Toast.info('请输入手机号', 1200);
      return
    }
    if (!this.userimgcode) {
      Toast.info('请输入图形验证码', 1200);
      return
    }
    service.login({
      loginName: this.username,
      password: md5(this.userpwd),
      vcode: this.usercode
    }, { Cookie: this.cookie }).then((res) => {
      if (res.code == 200) {
        Toast.info('登录成功', 1200);
        this.props.history.push('/')
      } else {
        Toast.info(res.msg, 1200);
      }
    }).catch((err) => {
      Toast.info('网络错误，请稍后再试', 1200);
    });
  }

  render() {
    const { regType, phone } = this.state
    let img = '';
    if (this.imgcode) {
      img = this.arrayBufferToBase64(this.imgcode);
    }
    return (
      <div className='regist'>
        <img className='regist-img' />
        <img className='regist-logo' />
        <div className='regist-child'>
          <p className='regist-child-title'>注册币U账号</p>
          <div className='reg-main'>
            <div className='tab-nav-box'>
              <div
                className={`${regType == 'phone_num' ? 'tab-active' : ''}`}
                onClick={this.changeRegType.bind(null, 'phone_num')}>
                手机注册
                </div>
              <div
                className={`${regType == 'email' ? 'tab-active' : ''}`}
                onClick={this.changeRegType.bind(null, 'email')}>
                邮箱注册
                </div>
            </div>
            <div className='tab-main-box'>
              <div>
                {
                  regType == 'phone_num' ? <div className='input-box' style={{ display: 'flex' }}>
                    <span style={{ paddingRight: '5%' }}>+86</span>
                    <input
                      style={{ width: '100%' }}
                      onInput={(e) => {
                        this.userphone = e.target.value
                      }}
                      type='number'
                      placeholder='请输入手机号'
                    />
                  </div> : <div className='input-box'>
                      <input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='请输入邮箱地址'
                        onInput={(e) => {
                          this.useremail = e.target.value
                        }}
                      />
                    </div>
                }
                <div className='input-box'>
                  <input
                    placeholder="请输入您的密码"
                    type='password'
                    onInput={(e) => {
                      this.userpwd = e.target.value
                    }}
                  />
                </div>
                {
                  regType == 'phone_num' ? <div className='login-child-divs'>
                    <input
                      onInput={(e) => {
                        this.userimgcode = e.target.value
                      }}
                      type='text'
                      placeholder='图形验证码'
                      className='login-child-codes'
                    />
                    <img onClick={() => {
                      this.getData('ValidateImageServlet', {}, 'get');
                    }} src={`data:image/png;base64,${img}`}></img>
                  </div> : null
                }
                <div className='input-box'>
                  <input
                    placeholder="请输入验证码"
                    type='text'
                    onInput={(e) => {
                      this.usercode = e.target.value
                    }}
                  />
                  <div onClick={() => { this.getCode() }} className='get-code-btn' >获取验证码</div>
                </div>
                <div className='input-box'>
                  <input
                    placeholder="请输入推荐人UID（选填）"
                    type='text'
                    style={{ width: '100%' }}
                    onInput={(e) => {
                      this.userincode = e.target.value
                    }}
                  />
                </div>
                <div className="switch-list">
                  <input type='checkbox' style={{ background: '#FFF' }} />
                  我已阅读并同意 <span onClick={() => {
                    window.location.href = 'http://www.byou89.com/about/about.html?id=1'
                  }} style={{ color: '#A77E45' }}>《用户协议》</span>
                </div>
                <div className='login-child-button'>
                  <img />
                  <span>立即注册</span>
                </div>
                <Link to="/login">
                  <div className='regist-btn' style={{ textAlign: 'right' }}>
                    <span className='login-child-resig'>登录</span>
                  </div>
                </Link>

              </div>
            </div>

          </div>

          {/* <InputItem
          className='regist-child-input'
            defaultValue={100}
            placeholder="start from left"
            clear
            moneyKeyboardAlign="left"
            
          ></InputItem> */}
        </div>
      </div >
    )
  }
}

export default Login;
