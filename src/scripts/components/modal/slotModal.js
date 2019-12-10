import React, { Component } from 'react';
import { observable } from "mobx";
import { observer, inject } from 'mobx-react';
import { forEach, get } from 'lodash'
import './index.scss';
import ModalRoot from './modalRoot';
import Toast from '../toast';

/*
 * 课程时间选择弹窗
 * @props:
 * from zhaojian@51talk.com
 */
@inject('rootStore')
@observer
class SlotModal extends Component {
    @observable isShow = false;
    @observable selectWeek = -1;

    constructor(props) {
        super(props);
        const { appointStore } = this.props.rootStore;
        this.appointStore = appointStore;
    }

    componentDidMount() {
        this.refs.modalRoot.showModal();
    }

    showModal = () => {
        this.appointStore.syncModalSelect();
        this.isShow = true;
    }

    hideModal = () => {
        this.appointStore.clearModalSelect();
        this.isShow = false;
    }

    getSlotWeek = () => {
        let { systemSlots } = this.props;
        let itemList = [];
        if (Array.isArray(systemSlots)) {
            forEach(systemSlots, (item, index) => {
                itemList.push(
                    <div
                        key={index}
                        onClick={() => { this.selectWeek = index }}
                        className={this.selectWeek === index ?
                            'slot-week-item' : 'slot-week-item unselected'}>
                        每{item.week}
                    </div>
                )
            })
        }
        return (
            <div className='slot-week-row'>
                {itemList}
            </div>
        )
    }

    getRegularSlotTime = () => {
        let { systemSlots } = this.props;
        let week = get(systemSlots, `[${this.selectWeek}]`, {});
        let slots = get(systemSlots, `[${this.selectWeek}].regular_slots`, []);
        let itemList = [];
        if (Array.isArray(slots)) {
            forEach(slots, (item, index) => {
                let className = 'slot-time-item';
                let childComponent = null;
                if (this.appointStore.getItemInList(week, item)) {
                    className = className + ' slot-time-item-selected';
                    childComponent = <img className='slot-time-item-img' />
                } else {
                    if (item.status === 1) {
                        className = className + ' slot-time-item-normal';
                    } else if (item.status === 2) {
                        className = className + ' slot-time-item-normal';
                        childComponent = <div className='slot-time-item-recomm'>推荐</div>
                    }
                }
                itemList.push(
                    <div
                        key={index}
                        onClick={() => {
                            if (item.status === 0) {
                                return
                            }
                            this.appointStore.addItem(week, item, true);
                        }}
                        className={className}>
                        {item.time}
                        {childComponent}
                    </div>
                )
            })
        }
        return (
            <div className='slot-regular-row'>
                <p>{get(this.appointStore.coursesData, 'line_text', '')}</p>
                <div className='slot-regular-child-row'>
                    {itemList}
                </div>
            </div>
        )
    }

    syncSelectList = () => {
        if (this.appointStore.modalSelect.length < this.appointStore.coursesData.min_slots) {
            Toast.info(`至少选择${this.appointStore.coursesData.min_slots}个上课时间`, 1200);
            return
        }
        this.appointStore.selectList = this.appointStore.modalSelect.slice(0, this.appointStore.modalSelect.length);
        this.hideModal()
    }

    getSlotTime = () => {
        let { systemSlots } = this.props;
        let week = get(systemSlots, `[${this.selectWeek}]`, {});
        let slots = get(systemSlots, `[${this.selectWeek}].slots`, []);
        let itemList = [];
        if (Array.isArray(slots)) {
            forEach(slots, (item, index) => {
                let className = 'slot-time-item';
                let childComponent = null;
                if (this.appointStore.getItemInList(week, item)) {
                    className = className + ' slot-time-item-selected';
                    childComponent = <img className='slot-time-item-img' />
                } else {
                    if (item.status === 1) {
                        className = className + ' slot-time-item-normal';
                    } else if (item.status === 2) {
                        className = className + ' slot-time-item-normal';
                        childComponent = <div className='slot-time-item-recomm'>推荐</div>
                    }
                }
                itemList.push(
                    <div
                        key={index}
                        onClick={() => {
                            if (item.status === 0) {
                                return
                            }
                            this.appointStore.addItem(week, item);
                        }}
                        className={className}>
                        {item.time}
                        {childComponent}
                    </div>
                )
            })
        }
        return (
            <div className='slot-time-row' >
                {itemList}
            </div>
        )
    }

    getSlotView = () => {
        return (
            <div className='slot-modal-child' onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }}>
                <div className='slot-modal-top'>
                    <img onClick={() => {
                        this.hideModal()
                    }} />
                </div>
                <div className='slot-modal-scroll'>
                    <div className='slot-modal-title'>
                        日期
                    </div>
                    {this.getSlotWeek()}
                    {this.selectWeek >= 0 &&
                        <div className='slot-modal-title'>
                            时间
                    </div>}
                    {this.selectWeek >= 0 && this.getSlotTime()}
                    {this.selectWeek >= 0 && this.getRegularSlotTime()}
                </div>
                <div onClick={() => {
                    this.syncSelectList();
                }} className={this.appointStore.getCanSave ? 'slot-modal-savebutton' : 'slot-modal-button'}>
                    <div>保存</div>
                </div>
            </div>
        )
    }

    render() {
        let { clickNoHide } = this.props
        return (
            <ModalRoot data={this.appointStore.modalSelect} ref='modalRoot'>
                <div className={this.isShow ? 'slot-modal-parent' : 'modal-hidden'} onClick={() => {
                    if (!clickNoHide) {
                        this.hideModal();
                    }
                }}>
                    {this.getSlotView()}
                </div>
            </ModalRoot>
        )
    }
}

export default SlotModal;
