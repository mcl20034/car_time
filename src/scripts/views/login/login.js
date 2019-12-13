import React from 'react';
import { Link } from 'react-router-dom';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './login.scss';


@inject('rootStore')
@observer
class Login extends React.Component {
  @observable time = 1;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //获取约课数据
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
        </div>
      </div>
    )
  }
}

export default Login;
