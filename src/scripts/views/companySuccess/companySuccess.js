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
    this.state = {
      show_qr: "none",
      my_opacity: 0,
    };
  }
  timer = null;
  componentDidMount() {}

  // 组件清除时清除定时器
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // 定时器
  iTimer = () => {
    let that = this;
    this.timer = setInterval(() => {
      let { my_opacity } = this.state;
      my_opacity += 0.2;
      if (my_opacity > 1) {
        clearInterval(that.timer);
      }
      this.setState({
        my_opacity: my_opacity,
      });
    }, 250);
  };

  render() {
    return (
      <div className="last_bg">
        <div className="car-content">
          <img
            className="car"
            src="https://cdn.deapsea.cn//car/h5/last_car.png"
          />
          <img
            className="light"
            style={{ opacity: this.state.my_opacity }}
            src="https://cdn.deapsea.cn//car/last_light.png"
            onLoad={() => {
              this.iTimer();
            }}
          />
          <img
            className="text"
            src="https://cdn.deapsea.cn//car/last_text.png"
            style={{ opacity: this.state.my_opacity }}
          />
        </div>
        <div className="qr_content" style={{ display: this.state.show_qr }}>
          <img
            className="qr_code_bg"
            src="https://cdn.deapsea.cn//car/car_qrcode_new.png"
          />
          <img
            className="qr_code_close"
            onClick={() => {
              this.setState({ show_qr: "none" });
            }}
          />
        </div>
        <div className="bottom">
          <div
            className="last-button"
            onClick={() => {
              window.location.href = "https://lp.m.moxueyuan.com";
            }}
          >
            <span>参加使用培训</span>
          </div>
          <div
            className="last-button"
            onClick={() => {
              this.setState({ show_qr: "flex" });
            }}
          >
            <span>进入小店</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanySuccess;
