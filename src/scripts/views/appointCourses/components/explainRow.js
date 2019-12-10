import React, { PureComponent, Component } from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';
import ExplainItem from './explainItem';
import '../app.scss';
import _ from 'lodash';
@observer
class ExplainRow extends Component {
    constructor(props) {
        super(props);
        this.explainList = [
            {
                title: '什么是省心约？',
                content: '省心约是为每周上课时间固定的学员，推出的系统自动约课功能。'
            },
            {
                title: '怎么使用？',
                content: '1.设置每周上课时间，保存<br/>2.打开省心约开关<br/>3.课前24小时即可查看约课信息<br/>4.按时上课'
            },
            {
                title: '约什么老师？',
                content: '优先预约收藏列表中的外教。如果约不到收藏外教，会根据你的收藏外教特点为你匹配相似外教。'
            },
            {
                title: '约什么教材？',
                content: '《经典英语青少版》当前级别教材。会根据你的学习进度自动匹配教材。<span style=\'font-size:12px;color:rgba(153, 153, 153, 1)\'>注：使用此功能期间，必须打开教材重排开关</span>'
            },
        ];
    }
    render() {
        let itemList = [];
        _.forEach(this.explainList, (item,index) => {
            itemList.push(
                <ExplainItem key={index} title={item.title}
                    content={item.content} />
            )
        });
        return (
            <div className='explain-parent'>
                <div className='explain-title'>
                    省心约功能说明
                    <img onClick={this.props.callBack} />
                </div>
                {itemList}
            </div>
        )
    }
}

export default ExplainRow;
