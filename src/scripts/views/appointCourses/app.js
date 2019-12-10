import React from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import SelectSlotRow from './components/selectSlotRow';
import './app.scss';
import SwitchRow from './components/switchRow';
import ExplainRow from './components/explainRow';
import { Modal,SlotModal,Toast } from '../../components';
@inject('rootStore')
@observer
class App extends React.Component {
  @observable time = 1;
  constructor(props) {
    super(props);
    const { appointStore } = this.props.rootStore;
    this.appointStore = appointStore;
  }
  componentDidMount() {
    //获取约课数据
    this.appointStore.getDetail();
  }

  saveTime=()=>{
    if (this.appointStore.selectList.length < this.appointStore.coursesData.min_slots) {
      Toast.info(`至少选择${this.appointStore.coursesData.min_slots}个上课时间`, 1200);
      return
    }
  }

  render() {
    let { coursesData } = this.appointStore;
    return (
      <div className="app">
        <div className='content-title'>宝贝每周上课时间</div>
        <div className='content-recommend'>
          根据你的学习情况，建议每<span>{coursesData.max_slots}节</span>周课</div>
        <SelectSlotRow callBack={()=>{this.saveTime()}}
         openModal={()=>{this.refs.slotModal.showModal()}}/>
        <SwitchRow />
        <ExplainRow callBack={() => { this.refs.modal.showModal() }}/>
        <div className='content-agreement'>查看<span>《使用协议》</span></div>
        <Modal
          ref='modal'
          title='什么是省心约？'
          content='省心约是为想固定每周上课时间的宝贝推出的自动约课功能。<br/>
          只需设置好每周上课时间（至少4节课/周）我们持续为宝贝自动约课奥。<br/>
          我们会优先预约宝贝收藏的外教。<br/>
          如果收藏外教未开课，我们会为您匹配适合您的优秀老师上课。<br/>
          省心约只适用于宝贝当前级别主修课教材。'
          okText='我知道了' />
          <SlotModal 
          ref='slotModal'
          systemSlots={this.appointStore.coursesData.system_slots}
          />
      </div>
    )
  }
}

export default App;
