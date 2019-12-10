import React, { Component } from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';
import { forEach } from 'lodash'
import './index.scss';
import ModalRoot from './modalRoot';
/*
 * 弹窗组件
 * @props:
 * children 当有子组件时，下列属性失效，展示子组件
 * title 弹窗标题，不传不展示
 * content 弹窗内容，可以是文字或组件，不传不展示
 * clickNoHide 点击周围透明区域是否隐藏弹窗
 * cancelText 取消按钮文字，不传不展示按钮
 * okText 确定按钮文字，不传不展示按钮
 * from zhaojian@51talk.com
 */
@observer
class Modal extends Component {

    constructor(props) {
        super(props);
    }

    showModal = () => {
        this.refs.modalRoot.showModal();
    }

    hideModal = () => {
        this.refs.modalRoot.hideModal();
    }

    getModalButton = () => {
        let { cancelText, okText, cancelPress, okPress } = this.props;
        let buttonList = [];
        if (!cancelText && !okText) {
            return null
        }
        if (cancelText && okText) {
            buttonList.push(
                <div key='cancel' className='cancel-button' onClick={() => {
                    cancelPress ? cancelPress() : this.hideModal();
                }}>
                    {cancelText}
                </div>
            );
            buttonList.push(
                <div key='ok' className='ok-button' onClick={() => {
                    okPress ? okPress() : this.hideModal();
                }}>
                    {okText}
                </div>
            );
        } else if (cancelText) {
            buttonList.push(
                <div key='cancel' className='cancel-button button-row' onClick={() => {
                    cancelPress ? cancelPress() : this.hideModal();
                }}>
                    {cancelText}
                </div>
            );
        } else if (okText) {
            buttonList.push(
                <div key='ok' className='ok-button button-row' onClick={() => {
                    okPress ? okPress() : this.hideModal();
                }}>
                    {okText}
                </div>
            );
        }
        return (
            <div className='modal-button'>
                {buttonList}
            </div>
        )
    }

    getModalChild = () => {
        let { title, content } = this.props;
        return (
            <div className='modal-child' onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }}>
                {title && <div className='modal-title'>{title}</div>}
                {content && <div className='modal-content' dangerouslySetInnerHTML={{__html:content}}></div>}
                {this.getModalButton()}

            </div>
        )
    }

    render() {
        let { children, clickNoHide } = this.props
        return (
            <ModalRoot ref='modalRoot'>
                <div className='modal-parent' onClick={() => {
                    if (!clickNoHide) {
                        this.refs.modalRoot.hideModal();
                    }
                }}>
                    {!children && this.getModalChild()}
                </div>
            </ModalRoot>
        )
    }
}

export default Modal;
