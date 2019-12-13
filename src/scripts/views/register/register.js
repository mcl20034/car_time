import React from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import './register.scss';
import { InputItem, List, Flex, AgreeItem } from 'antd-mobile';

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
              {
                regType == 'phone_num' ? <div>
                  <List>
                    <div className='input-box' style={{ display: 'flex' }}>
                      <span style={{ paddingRight: '5%' }}>+86</span>
                      <InputItem
                        style={{ width: '100px' }}
                        clear
                        ref={ref => this.inputNumber = ref}
                        value={phone}
                        type='number'
                        placeholder='请输入手机号'
                        onChange={this.changePhone}
                      > </InputItem>
                    </div>
                    <div className='input-box'>
                      <InputItem
                        placeholder="请输入您的密码"
                        clear
                        type={'password'}
                        moneyKeyboardAlign="left"
                      ></InputItem>
                    </div>
                    <div className='input-box'>
                      <InputItem
                        placeholder="请输入验证码"
                        clear
                        type='number'
                        moneyKeyboardAlign="left"
                      ></InputItem>
                      <div className='get-code-btn' >获取验证码</div>
                    </div>
                    <div className='input-box'>
                      <InputItem
                        placeholder="请输入推荐人UID（选填）"
                        clear
                        type='text'
                        style={{ width: '100%' }}
                      ></InputItem>
                    </div>
                  </List>
                  <div class="switch-list">
                    <input type='checkbox' style={{background:'#FFF'}}/>
                    我已阅读并同意

                  </div>
                </div> : <div>
                    邮箱
                  </div>
              }
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
