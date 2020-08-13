// const axios = require('axios');
import axios from "axios";
import apiConf from "../config/api";

export default class BaseService {
  constructor() {
    let adaptor = {
      dev: "", // 开发环境接口地址
      prod: "", // 上线环境接口地址
    };
    // console.log(`环境是${process.env.NODE_ENV}`);
    this._domain = adaptor[process.env.NODE_ENV];
  }
  /**
   * 获取请求api地址
   * @param {string} urlKey api对应的key
   * @return {string} 返回要请求的api地址
   */
  getRequestApiUrl(urlKey) {
    //简单正则，判断是否是完整的url，如果是完整的url，则直接返回
    let regExp = /^https:\/\/([^/]+)\//gi;
    if (regExp.test(urlKey)) {
      return urlKey;
    } else {
      return `${this._domain}/${apiConf[urlKey]}`;
    }
  }

  async getData(urlKey, data, method = "post", showErr = true, header) {
    let _this = this;
    let headers = {
      "X-Requested-Width": "XMLHttpRequest",
      "Content-Type": "application/json",
    };
    let token = localStorage.getItem("token-key");
    if (token) {
      headers["token"] = token;
    }
    if (header) {
      headers["Mobile-Cookie"] = header.Cookie;
    }
    // console.log('请求url', _this.getRequestApiUrl(urlKey));
    return new Promise(function(resolve, reject) {
      axios({
        method: method,
        headers: headers,
        url: _this.getRequestApiUrl(urlKey),
        data: data || {},
        params: method === "get" ? data : {},
      })
        .then((res) => {
          res = res.data;
          // if (res.code !== 10000 && showErr) {
          //   console.warn(res.message || '网络繁忙，请稍候再试');
          //   // vue.$toast(res.message || '网络繁忙，请稍候再试');
          // }
          resolve(res);
        })
        .catch((err) => {
          // vue.$toast('网络繁忙，请稍候再试');
          reject({
            code: 500,
            message: "网络繁忙，请稍候再试",
          });
        });
    });
  }
}
