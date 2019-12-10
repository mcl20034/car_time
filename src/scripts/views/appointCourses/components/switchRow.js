import React, { PureComponent } from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import SelectedSlotItem from './selectedSlotItem'
import { forEach } from 'lodash'
import '../app.scss';
import { Switch } from '../../../components';
/*
 * 已选时间和选择时间按钮展示
 * @params 
 * from zhaojian@51talk.com
 */
@inject('rootStore')
@observer
class SwitchRow extends PureComponent {
    @observable isOpen = false;
    constructor(props) {
        super(props);
        const { appointStore } = this.props.rootStore;
        this.appointStore = appointStore;
    }

    changeOpen = () => {
        this.isOpen = !this.isOpen;
    }

    render() {
        return (
            <div className='switch-parents'>
                <div className={this.isOpen ? 'switch-row switch-row-selected' : 'switch-row'}>
                    <span>
                        省心约
                        {this.isOpen && <span>正在努力为您预约老师…</span>}
                    </span>
                    <div>
                        <span>
                            {this.isOpen ? '已开启' : '待开启'}
                        </span>
                        <Switch
                            isOpen={this.isOpen}
                            callBack={this.changeOpen} />
                    </div>
                </div>
                {this.isOpen && <div className='switch-button' onClick={() => {
                    window.location.href = 'app51talk://timetable'
                }}>进入我的课表</div>}
            </div>
        )
    }
}

export default SwitchRow;
