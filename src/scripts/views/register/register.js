import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './register.scss';

// const REGISTER_type = [
//   {
//     id:'',
//     name:'手机注册'
//   },
//   {
//     id:'email',
//     name:'邮箱注册'
//   },
// ]

@inject('rootStore')
@observer
class Login extends React.Component {
  @observable time = 1;
  constructor(props) {
    super(props);
    this.state = {
      regType: 'phone_num',
      phone: '',
    }
  }
  componentDidMount() {
    //获取约课数据
  }
  changeRegType = (type) => {
    console.log('console log for chrom type', type);
    this.setState({
      regType: type
    })
  }
  changePhone = (value) => {
    console.log('console log for chrom value', value);
    return this.setState({
      phone: value
    })
  }

  render() {
    const { regType, phone } = this.state
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
                      type='number'
                      placeholder='请输入手机号'
                      onChange={this.changePhone}
                    />
                  </div> : <div className='input-box'>
                      <input
                        style={{ width: '100%' }}
                        type='text'
                        placeholder='请输入邮箱地址'
                        onChange={this.changePhone}
                      />
                    </div>
                }
                <div className='input-box'>
                  <input
                    placeholder="请输入您的密码"
                    type='password'
                  />
                </div>
                <div className='input-box'>
                  <input
                    placeholder="请输入验证码"
                    type='number'
                  />
                  <div className='get-code-btn' >获取验证码</div>
                </div>
                <div className='input-box'>
                  <input
                    placeholder="请输入推荐人UID（选填）"
                    clear
                    type='text'
                    style={{ width: '100%' }}
                  />
                </div>
                <div class="switch-list">
                  <input type='checkbox' style={{ background: '#FFF' }} />
                  我已阅读并同意 <span style={{ color: '#A77E45' }}>《用户协议》</span>
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
