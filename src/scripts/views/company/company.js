import React from "react";
import { observable } from "mobx";
import { observer, inject } from "mobx-react";
import "./company.scss";
import Service from "../../services/coursesService";
const service = new Service();
import axios from "axios";
import apiConf from "../../config/api";
import { Toast } from "../../components";
import { forEach, get } from "lodash";
import RadioGroup from "../appointCourses/components/radioGroup.js";
import wx from "weixin-js-sdk";
import LinesEllipsis from "react-lines-ellipsis";

import md5 from "md5";
@inject("rootStore")
@observer
class Company extends React.Component {
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
      current_index: 0,
      form1_display_name: "none",
      form2_display_name: "none",
      subDatas: [
        { name: "微信授权", active: true },
        { name: "经销商信息", active: false },
        { name: "快手信息", active: false },
        { name: "开店完成", active: false },
      ],
      brandChannel: "",
      brandName: "",
      name: "",
      contacts: "",
      mobile: "",
      address: "",
      ksNo: "",
      opened_radioOptions: [
        {
          id: "id-has",
          value: 1,
          text: "已开通",
        },
        {
          id: "id-none",
          value: 0,
          text: "未开通",
        },
      ],
      opened: 0,
      joined_radioOptions: [
        {
          id: "id-has-joined",
          value: 1,
          text: "已加入",
        },
        {
          id: "id-none-joined",
          value: 0,
          text: "未加入",
        },
      ],
      joined: 0,
      appId: "",
    };
  }

  handleRadioChange = () => {
    let { opened } = this.state;
    this.setState(
      {
        opened: opened == 0 ? 1 : 0,
      },
      () => {
        console.log(this.state.opened);
      }
    );
  };

  handleJoinedRadioChange = () => {
    let { joined } = this.state;
    this.setState(
      {
        joined: joined == 0 ? 1 : 0,
      },
      () => {
        console.log(this.state.joined);
      }
    );
  };

  renderNext = (c_index) => {
    console.log("renderNext", c_index);
    let { subDatas, form1_display_name, form2_display_name } = this.state;
    forEach(subDatas, (item, index) => {
      item.active = index <= c_index;
    });
    form1_display_name = "none";
    form2_display_name = "none";
    if (c_index == 1) {
      form1_display_name = "block";
    }
    if (c_index == 2) {
      form2_display_name = "block";
    }
    this.setState({
      form1_display_name: form1_display_name,
      form2_display_name: form2_display_name,
      subDatas: subDatas,
      current_index: c_index,
    });
    localStorage.setItem("current_index", c_index);
    if (c_index == 3) {
      this.props.history.push("/companySuccess");
    }
  };

  onnext = () => {
    let {
      current_index,
      brandChannel,
      name,
      contacts,
      mobile,
      address,
      lat,
      lng,
      ksNo,
    } = this.state;
    console.log("onnext", current_index);
    let next_index = Number(current_index) + 1;
    switch (next_index) {
      case 1: {
        this.renderNext(next_index);
        break;
      }
      case 2: {
        if (!brandChannel) {
          Toast.info("请输入品牌厂家", 1200);
          return;
        }
        if (!name) {
          Toast.info("请输入经销商全称", 1200);
          return;
        }
        if (!contacts) {
          Toast.info("请输入联系人", 1200);
          return;
        }
        if (contacts.length > 5) {
          Toast.info("请输入正确的联系人姓名", 1200);
          return;
        }
        if (!mobile) {
          Toast.info("请输入手机号", 1200);
          return;
        }
        if (mobile.length != 11 || mobile[0] != "1") {
          Toast.info("请输入正确的手机号", 1200);
          return;
        }
        if (!address) {
          Toast.info("请输入地址", 1200);
          return;
        }
        if (!lat || !lng) {
          Toast.info("请输入经纬度", 1200);
          return;
        }
        this.companyRegister(next_index);
        break;
      }
      case 3: {
        if (!ksNo) {
          Toast.info("请输入快手账号ID/账号", 1200);
          return;
        }
        this.ksRegister(next_index);
        break;
      }
    }
  };

  componentDidMount() {
    let token = localStorage.getItem("token-key");
    let code = this.getQueryVariable("code");
    if (code) {
      this.getUser(code);
    } else {
      this.getSign();
      // localStorage.setItem(
      //   "token-key",
      //   "union_7c936c30ca75afd509f457f31fb59f19"
      // );
    }

    let lat = localStorage.getItem("lat");
    let lng = localStorage.getItem("lng");
    let address = localStorage.getItem("address");
    if (address == null) {
      address = "";
    }

    this.setState({
      lat: lat,
      lng: lng,
      address: address,
    });

    let current_index = localStorage.getItem("current_index");
    // current_index = 2;
    if (current_index != null && current_index >= 1) {
      console.log("componentDidMount", current_index);
      this.setState({ current_index });
      this.renderNext(current_index);
    } else {
      this.setState({ current_index: 0 });
    }

    let brandChannel = localStorage.getItem("brandChannel");
    if (brandChannel) {
      this.setState({
        brandChannel: brandChannel,
      });
    }

    let brandName = localStorage.getItem("brandName");
    if (brandName) {
      this.setState({
        brandName: brandName,
      });
    }

    let name = localStorage.getItem("name");
    if (name) {
      this.setState({
        name: name,
      });
    }

    let contacts = localStorage.getItem("contacts");
    if (contacts) {
      this.setState({
        contacts: contacts,
      });
    }

    let mobile = localStorage.getItem("mobile");
    if (mobile) {
      this.setState({
        mobile: mobile,
      });
    }
  }

  getSign = () => {
    service
      .getSign({})
      .then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.getAuthUrl();
        } else {
          Toast.info(res.msg, 1200);
        }
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  getAuthUrl = () => {
    service
      .getAuthUrl({
        mode: "userinfo",
        page: "https://test.taoxiangche.com/wxAuth/index.html#/company",
      })
      .then((res) => {
        window.location.href = res.data.authUrl;
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  getUser = (code) => {
    let _this = this;
    service
      .getUser({
        code: code,
      })
      .then((res) => {
        localStorage.setItem("token-key", res.data.token.union_token);
        _this.renderNext(1);
        _this.setState({ current_index: 1 });
      })
      .catch((err) => {
        // Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  companyRegister = (current_index) => {
    let {
      brandChannel,
      name,
      contacts,
      mobile,
      address,
      lat,
      lng,
    } = this.state;
    service
      .companyRegister({
        brandChannel: brandChannel,
        name: name,
        contacts: contacts,
        mobile: mobile,
        address: address,
        latitude: lat,
        longitude: lng,
      })
      .then((res) => {
        if (res.code == 0) {
          this.renderNext(current_index);
        } else {
          Toast.info(res.message, 1200);
          this.setState({
            current_index: 1,
          });
          localStorage.setItem("current_index", 1);
        }
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
        this.setState({
          current_index: 1,
        });
        localStorage.setItem("current_index", 1);
      });
  };

  ksRegister = (current_index) => {
    let { ksNo, opened, joined } = this.state;
    service
      .ksRegister({
        ksNo: ksNo,
        opened: opened,
        joined: joined,
      })
      .then((res) => {
        if (res.code == 0) {
          this.renderNext(current_index);
        } else {
          Toast.info(
            "您提交的快手ID/账号信息同经销商信息不符，请核对后再次提交",
            1200
          );
          this.setState({
            current_index: 2,
          });
          localStorage.setItem("current_index", 2);
        }
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
        this.setState({
          current_index: 1,
        });
        localStorage.setItem("current_index", 1);
      });
  };

  /**
   * 获取url参数
   * @param {variable} 参数名
   * @returns 返回参数值，未找到为空字符串
   * from zhaojian@51talk.com
   */
  getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return "";
  };

  render() {
    let subList = [];
    let { subDatas } = this.state;
    forEach(subDatas, (item, index) => {
      subList.push(
        <div key={index + "n"}>
          <span className={item.active ? "selected" : "unselected"}>
            {item.name}
          </span>
          {index < subDatas.length - 1 ? <img /> : ""}
        </div>
      );
    });
    return (
      <div className="bg">
        <img className="bg1" src="https://cdn.deapsea.cn//car/bg.png" />
        <div className="company-top">
          <span>信息登记</span>
          <img />
        </div>
        <div className="company-sub-top">{subList}</div>
        <div
          className="company-form1"
          style={{ display: this.state.form1_display_name }}
        >
          <div className="company-form1-content">
            <span>信息登记</span>
            <img className="form1-item-line" />
            <div className="form1-item">
              <span>品牌/厂家：</span>
              <input
                type="text"
                placeholder="请选择品牌/厂家"
                className="form1-input"
                defaultValue={this.state.brandName}
                onClick={() => {
                  this.props.history.push("/brand");
                }}
              />
              <img
                src="https://cdn.deapsea.cn//car/h5_right.png"
                className="right"
              />
            </div>
            <div className="form1-item">
              <span>经销商全称：</span>
              <input
                type="text"
                placeholder="请填写经销商全称"
                className="form1-input"
                defaultValue={this.state.name}
                onInput={(e) => {
                  this.setState({
                    name: e.target.value,
                  });
                  localStorage.setItem("name", e.target.value);
                }}
              />
            </div>
            <div className="form1-item">
              <span>联系人：</span>
              <input
                type="text"
                placeholder="请填写联系人"
                className="form1-input"
                defaultValue={this.state.contacts}
                onInput={(e) => {
                  this.setState({
                    contacts: e.target.value,
                  });
                  localStorage.setItem("contacts", e.target.value);
                }}
              />
            </div>
            <div className="form1-item">
              <span>手机：</span>
              <input
                type="text"
                placeholder="请填写手机号"
                className="form1-input"
                defaultValue={this.state.mobile}
                onInput={(e) => {
                  this.setState({
                    mobile: e.target.value,
                  });
                  localStorage.setItem("mobile", e.target.value);
                }}
              />
            </div>
            <div className="form1-item">
              <span className="address">地址：</span>
              <LinesEllipsis
                className="form1-lines-ellipsis"
                text={this.state.address}
                maxLine="2"
                ellipsis="..."
                trimRight
                onClick={() => {
                  this.props.history.push("/gdmap");
                }}
              />
              <img
                src="https://cdn.deapsea.cn//car/h5_ditu.png"
                className="map"
              />
            </div>
            <img className="form1-item-bottom" />
          </div>
        </div>
        <div
          className="company-form2"
          style={{ display: this.state.form2_display_name }}
        >
          <div className="company-form2-content">
            <span>快手信息</span>
            <img className="form2-item-line" />
            <div className="form2-item">
              <span>快手账号ID/账号:</span>
              <input
                type="text"
                placeholder="请填写快手账号"
                className="form2-input"
                onInput={(e) => {
                  this.setState({
                    ksNo: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form2-item">
              <span>是否已开通商家蓝V:</span>
              <div className="horizontal">
                <div className="radio_item" onClick={this.handleRadioChange}>
                  <img
                    src={
                      this.state.opened === 0
                        ? "https://cdn.deapsea.cn//car/h5/radio_bg.png"
                        : "https://cdn.deapsea.cn//car/h5/radio_checked_bg.png"
                    }
                  />
                  已开通
                </div>
                <div className="radio_item" onClick={this.handleRadioChange}>
                  <img
                    src={
                      this.state.opened === 0
                        ? "https://cdn.deapsea.cn//car/h5/radio_checked_bg.png"
                        : "https://cdn.deapsea.cn//car/h5/radio_bg.png"
                    }
                  />
                  未开通
                </div>
              </div>
            </div>
            <div className="form2-item">
              <span>是否加入品牌矩阵:</span>
              <div className="horizontal">
                <div
                  className="radio_item"
                  onClick={this.handleJoinedRadioChange}
                >
                  <img
                    src={
                      this.state.joined === 0
                        ? "https://cdn.deapsea.cn//car/h5/radio_bg.png"
                        : "https://cdn.deapsea.cn//car/h5/radio_checked_bg.png"
                    }
                  />
                  已开通
                </div>
                <div
                  className="radio_item"
                  onClick={this.handleJoinedRadioChange}
                >
                  <img
                    src={
                      this.state.joined === 0
                        ? "https://cdn.deapsea.cn//car/h5/radio_checked_bg.png"
                        : "https://cdn.deapsea.cn//car/h5/radio_bg.png"
                    }
                  />
                  未开通
                </div>
              </div>
            </div>
            <img className="form2-item-bottom" />
          </div>
        </div>
        <div className="company-next-button" onClick={this.onnext}>
          下一步
        </div>
      </div>
    );
  }
}

export default Company;
