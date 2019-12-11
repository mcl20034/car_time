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
            placeholder="start from left"
            clear
            moneyKeyboardAlign="left"

          ></InputItem>
        </div>
      </div>
    )
  }
}

export default Login;
