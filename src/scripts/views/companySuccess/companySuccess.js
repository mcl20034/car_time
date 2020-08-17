import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import "./companySuccess.scss";
import Service from "../../services/coursesService";
const service = new Service();
import axios from "axios";
import apiConf from "../../config/api";
import { Toast } from "../../components";
import { forEach, get } from "lodash";

@inject("rootStore")
@observer
class CompanySuccess extends React.Component {
  constructor(props) {
    super(props);

    let adaptor = {
      dev: "", // 开发环境接口地址
      prod: "", // 上线环境接口地址
    };
    // console.log(`环境是${process.env.NODE_ENV}`);
    this._domain = adaptor[process.env.NODE_ENV];
    this.data = null;
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="last_bg">
        <img className="light" />
        <img className="text" />
        <div className="qr_content">
          <img className="qr_code" />
        </div>
        <div className="last-button">
          <span>参加使用培训</span>
        </div>
      </div>
    );
  }
}

export default CompanySuccess;
