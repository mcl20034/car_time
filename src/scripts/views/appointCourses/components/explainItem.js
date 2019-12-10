import React, { PureComponent, Component } from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';

import '../app.scss';

@observer
class ExplainItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { title, content } = this.props;
        console.log('console log to chrome content',content);
        return (
            <div>
                <div className='explain-item-title'>
                    <img />
                    <span>{title}</span>
                </div>
                <div className='explain-item-content'>
                    <div className='explain-item-content-child' dangerouslySetInnerHTML={{__html:content}}></div>
                    <img />
                </div>
            </div>
        )
    }
}

export default ExplainItem;
