import React, { PureComponent } from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import SelectedSlotItem from './selectedSlotItem'
import { forEach, get } from 'lodash'
import '../app.scss';
/*
 * 已选时间和选择时间按钮展示
 * @params 
 * from zhaojian@51talk.com
 */
@inject('rootStore')
@observer
class SelectSlotRow extends PureComponent {
    constructor(props) {
        super(props);
        const { appointStore } = this.props.rootStore;
        this.appointStore = appointStore;
    }

    render() {
        let { callBack,openModal } = this.props;
        let itemList = [];
        let maxSlot = get(this.appointStore, 'coursesData.max_slots', 0);
        for (let i = 0; i < maxSlot; i++) {
            if (i < this.appointStore.selectList.length) {
                itemList.push(
                    <SelectedSlotItem
                        key={i}
                        type={'selected'}
                        data={this.appointStore.selectList[i]}
                        closeBack={() => {
                            this.appointStore.closeItem(i)
                        }}
                    />
                )
            } else {
                itemList.push(
                    <SelectedSlotItem
                        key={i}
                        type={'select'}
                        closeBack={() => {
                            this.appointStore.closeItem(index)
                        }}
                        addBack={() => {
                            // this.appointStore.addItem(index)
                            openModal && openModal();
                        }}
                    />
                )
            }
        }
        return (
            <div className='select-slot'>
                <div className='selected-row'>
                    {itemList}
                </div>
                {this.appointStore.getHaveSelected &&
                    <div className='save-button' onClick={this.props.callBack}>保存时间</div>}
                <div className='line'></div>
            </div>
        )
    }
}

export default SelectSlotRow;
