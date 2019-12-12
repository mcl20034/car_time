import React from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './login.scss';
import { InputItem } from 'antd-mobile';

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
          <InputItem
            className='login-child-input'
            placeholder="手机号/邮箱"
            clear
            moneyKeyboardAlign="left"
          ></InputItem>
          <InputItem
            className='login-child-password'
            placeholder="密码"
            clear
            type={'password'}
            moneyKeyboardAlign="left"
          ></InputItem>
          <div className='login-child-button'>
            <img/>
            <span>立即登录</span>
          </div>
          <div className='login-child-row'>
            <span className='login-child-forgat'>忘记密码?</span>
            <span className='login-child-resig'>注册账号</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
