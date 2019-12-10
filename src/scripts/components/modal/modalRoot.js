// These two containers are siblings in the DOM
import React from 'react';
import ReactDOM from 'react-dom'

const modalRoot = window.document.body;
export default class ModalRoot extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    showModal = () => {
        modalRoot.appendChild(this.el);
    }

    hideModal = () => {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el,
        );
    }
}