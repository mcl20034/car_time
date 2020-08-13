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
      opened: 1,
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
      joined: 1,
    };
  }

  handleRadioChange = (e, args) => {
    this.setState({
      opened: parseInt(e.currentTarget.value),
    });
  };

  handleJoinedRadioChange = (e, args) => {
    this.setState({
      joined: parseInt(e.currentTarget.value),
    });
  };

  renderNext = (c_index) => {
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
    });
    localStorage.setItem("current_index", c_index);
  };

  onnext = () => {
    let { current_index } = this.state;
    let next_index = current_index + 1;
    switch (next_index) {
      case 1: {
        this.renderNext(next_index);
        break;
      }
      case 2: {
        this.companyRegister(next_index);
        break;
      }
      case 3: {
        this.ksRegister(next_index);
        break;
      }
    }
    this.setState({
      current_index: next_index,
    });
  };

  componentDidMount() {
    let code = this.getQueryVariable("code");
    console.log("code: ", code);
    if (code) {
      this.getUser(code);
    } else {
      // this.getSign();
      localStorage.setItem(
        "token-key",
        "union_d64bdb0890b43cb92a9bbf8d5e0b22a3"
      );
    }

    let current_index = localStorage.getItem("current_index");
    if (current_index) {
      this.renderNext(current_index);
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

    let address = localStorage.getItem("address");
    if (address) {
      this.setState({
        address: address,
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
        console.log(res.data.authUrl);
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
        console.log(res.data.token.union_token);
        localStorage.setItem("token-key", res.data.token.union_token);
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  companyRegister = (current_index) => {
    this.renderNext(current_index);
    let { brandChannel, name, contacts, mobile, address } = this.state;
    service
      .companyRegister({
        brandChannel: brandChannel,
        name: name,
        contacts: contacts,
        mobile: mobile,
        address: address,
      })
      .then((res) => {
        this.renderNext(current_index);
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
      });
  };

  ksRegister = (current_index) => {
    this.renderNext(current_index);
    let { ksNo, opened, joined } = this.state;
    service
      .ksRegister({
        ksNo: ksNo,
        opened: opened,
        joined: joined,
      })
      .then((res) => {
        this.renderNext(current_index);
      })
      .catch((err) => {
        Toast.info("网络错误，请稍后再试", 1200);
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
            <img className="form1-item-line1" />
            <div className="form1-item">
              <span>地址：</span>
              <input
                type="text"
                placeholder="请选择地址"
                className="form1-input"
                defaultValue={this.state.address}
                onInput={(e) => {
                  this.setState({
                    address: e.target.value,
                  });
                  localStorage.setItem("address", e.target.value);
                }}
                onClick={() => {
                  this.props.history.push("/gdmap");
                }}
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
                className="form1-input"
                onInput={(e) => {
                  this.setState({
                    ksNo: e.target.value,
                  });
                }}
              />
            </div>
            <div className="form2-item">
              <span>是否已开通商家蓝V:</span>
              <RadioGroup
                id="id"
                name="dqhan-name"
                isHorizontal={true}
                items={this.state.opened_radioOptions}
                checkedValue={this.state.opened}
                checkChanged={this.handleRadioChange}
              />
            </div>
            <div className="form2-item">
              <span>是否加入品牌矩阵:</span>
              <RadioGroup
                id="joined_id"
                name="joined-name"
                isHorizontal={true}
                items={this.state.joined_radioOptions}
                checkedValue={this.state.joined}
                checkChanged={this.handleJoinedRadioChange}
              />
            </div>
            <img className="form2-item-bottom" />
          </div>
        </div>
        <div className="company-next-button" onClick={this.onnext}>
          <span>下一步</span>
        </div>
      </div>
    );
  }
}

export default Company;
