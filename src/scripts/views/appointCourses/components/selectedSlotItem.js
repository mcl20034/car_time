import React, { PureComponent, Component } from 'react';
import { observable } from "mobx";
import { observer } from 'mobx-react';

import '../app.scss';

@observer
class SelectedSlotItem extends Component {
    @observable time = 1;
    @observable itemList = [];
    constructor(props) {
        super(props);
    }
    render() {
        let { type, data } = this.props;
        if (type === 'selected') {
            return (
                <div className='selected-item'>
                    <div className='selected-child'>
                        <div>
                            <div>每{data.week}</div>
                            <div>{data.time}</div>
                        </div>
                    </div>
                    <img className='selected-close' onClick={this.props.closeBack} />
                </div>
            )
        }
        return (
            <div className='select-item' onClick={this.props.addBack}>
                +
            </div>
        )
    }
}

export default SelectedSlotItem;
