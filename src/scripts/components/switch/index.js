import React, { Component } from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';
import { forEach } from 'lodash'
import './index.scss';
/*
 * 开关组件
 * @params 
 * from zhaojian@51talk.com
 */
@observer
class Switch extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { isOpen, callBack } = this.props;
        return (
            <div className={isOpen ? 'switch-parent switch-parent-selected' : 'switch-parent'}
                onClick={() => { callBack && callBack() }}>
                <div className='switch-child'>

                </div>
            </div>
        )
    }
}

export default Switch;
