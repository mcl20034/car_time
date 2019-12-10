/*
 * @desc: sdk方法封装
 * @author: leweiming
 * @date: 2019-08-30
 */

import {
  Howl,
  Howler
} from "howler";

Howler.html5PoolSize = 100;
var isAndroid = /android/i.test(navigator.userAgent); // android 
var isiOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream; // ios
const isApp = /51TalkHybridWebView/i.test(navigator.userAgent); // 是否在APP内部
// navigator.userAgent.match(/51TalkHybridWebView\-(\w+)\-(\w+)\-(\d+\.\d+\.\d+)/)
const appVersion = isApp ? navigator.userAgent.match(/51TalkHybridWebView\-(\w+)\-(\w+)\-(\d+\.\d+\.\d+)/)[3] : null;

/**
 * 比较版本大小
 *
 * @param {string} v1 x.y.z
 * @param {string} v2 x.y.z
 * @returns 0 v1===v1 -1 v1 < v2 1 v1 > v2
 */
function compareVersion(v1, v2) {
  if (v1 === v2) return 0;

  const v1Versions = v1.split('.');
  const v2Versions = v2.split('.');

  // 空置为0
  const v1Major = v1Versions[0] === '' ? 0 : parseInt(v1Versions[0]);
  const v2Major = v2Versions[0] === '' ? 0 : parseInt(v2Versions[0]);

  if (v1Major > v2Major) {
    return 1;
  } else if (v1Major < v2Major) {
    return -1;
  } else {
    return compareVersion(v1Versions.slice(1).join('.'), v2Versions.slice(1).join('.'));
  }
}

function logger(...args) {
  try {
    console.log(...args);
    if (typeof window.itextbookLogger === 'function') itextbookLogger('sdk', JSON.stringify(args));
  } catch (ignored) { }
}

function addLoadEvent(func) {
  const onload = window.onload;
  if (typeof onload === 'function') {
    window.onload = function () {
      try {
        onload();
      } catch (ignored) { } finally {
        func();
      }
    }
  } else {
    window.onload = func;
  }
}

addLoadEvent(function () {
  logger(`isAndroid: ${isAndroid}, isiOS: ${isiOS}, isApp: ${isApp}, appVersion: ${appVersion}`);
});

function once(fn, context) {
  var result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}

/**
 * 获取音频时长
 *
 * @param {string} url - 
 * @param {Function} cb - 回调函数
 *          - err 
 *          - duration
 * @returns
 */
function getAudioDuration(url, cb) {
  let audio = new Audio();
  audio.autoplay = "metadata";
  audio.volume = 0;
  audio.src = url;
  audio.onerror = (err) => {
    cb(err);
    audio = null;
  };

  audio.onloadedmetadata = () => {
    cb(null, audio.duration);
    audio = null;
  };
}

var jsBridge = (function () {
  if (isiOS) {
    return function (callback) {
      //iOS配置
      if (window.WebViewJavascriptBridge) {
        console.log("ios WebViewJavascriptBridge");
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        console.log("ios WVJBCallbacks");
        return window.WVJBCallbacks.push(callback);
      }

      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement("iframe");
      WVJBIframe.style.display = "none";
      WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
      console.log("ios iframe");
    };
  } else {
    //Android端配置
    // 惰性函数
    return function (callback) {
      if (window.WebViewJavascriptBridge) {
        console.log("android WebViewJavascriptBridge");
        callback(WebViewJavascriptBridge);
      } else {
        console.log("android addEventListener");
        document.addEventListener(
          "WebViewJavascriptBridgeReady",
          function () {
            callback(WebViewJavascriptBridge);
          },
          false
        );
      }
    };
  }
})();

class JSBridge {
  constructor(unitID, cb) {
    this.unitID = unitID || '';
    this.jsBridge = jsBridge;
    // 为html5音频播放做的对象及id
    // 播放对象当前只能有一个
    this.audioPlayer = null;
    this.playerId = null;
    this.playingURL = null; // 当前播放的url，作为区分播放id的标志
    // this.playCollection = [];
    if (this.unitID) {
      // 有unitID，说明需要调用录音功能
      this.init(cb);
    }
  }
  init(cb) {
    this.initSDK(data => {
      if (data.code === 1) {
        cb && typeof cb === "function" && cb();
      }
    });
  }
  /**
   * 注册前端调用sdk的接口
   * @param {string} methodName sdk提供的接口名
   * @param {any} data 接口所需数据
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  _call(methodName, data, cb) {
    var start = Date.now();
    if (typeof cb === "function") {
      var _cb = cb;
      cb = function (data) {
        const end = Date.now();
        logger("return", methodName, data, end - start);
        return _cb(data);
      };
    }

    this.jsBridge(function (sdk) {
      logger("call", methodName, data, start);
      sdk.callHandler(methodName, data, cb);
    });
  }
  /**
   * 前端注册sdk需要调用的接口
   * @param {string} methodName sdk提供的接口名
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  registry(methodName, cb) {
    this.jsBridge(sdk => {
      sdk.registerHandler(methodName, cb);
    });
  }
  /**
   * 开始录音
   * @param {string} data 录音音频的文本内容
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  startRecord(data, cb) {
    data = data.trim();
    if (isApp) {
      if (appVersion) {
        // >= 2.6.0
        if (compareVersion(appVersion, '2.6.0') >= 0) {
          if (/\s/.test(data)) {
            data = {
              sentence: data
            };
          } else {
            data = {
              word: data
            };
          }
        } else {
          // < 2.6.0 
          // android 支持
          if (isAndroid) {
            if (/\s/.test(data)) {
              data = {
                sentence: data
              };
            } else {
              data = {
                word: data
              };
            }
          } else if (isiOS) {
            // iOS 只支持 sentence
            data = {
              sentence: data
            };
          } else {
            data = {
              sentence: data
            };
          }
        }
      } else {
        data = {
          sentence: data
        };
      }
      this._call("startRecord", JSON.stringify(data));
      cb({
        code: 0
      });
    } else {
      console.log("startRecord");
      cb({
        code: 0
      });
    }
  }
  /**
   * 停止录音
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  stopRecord(cb) {
    if (!isApp) {
      console.log("stopRecord");
      cb({
        code: 0,
        score: 87,
        url: "http://s.itextbook.51talk.com/4A/80/DFE65B6CC6C6422CE2B503BE59A3.mp3"
      });
    }
    this._call("stopRecord", JSON.stringify({}), function (res) {
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
      if (res.code === 0) {
        res.url = res.uploadURL;
      }
      cb(res);
    });
  }
  /**
   * 音频播放，无论前端还是app播放，判断的唯一性是根据链接来判断的
   * 所以，如果是同一链接的不同播放，请主动给链接加上不同的参数
   * @param {string} url 播放音频链接
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  playAudio(url, cb) {
    cb = once(cb);
    if (isApp) {
      this._call(
        "startAudio",
        JSON.stringify({
          url: url
        }),
        cb
      );

      // fix: 处理播放完成没有回调问题
      getAudioDuration(url, (err, duration) => {
        if (err) duration = 60; // 给一个默认时长
        console.log(`duration[${url}]: `, duration);
        setTimeout(() => {
          cb({
            code: 0
          })
        }, duration * 1000);
      });
    } else {
      if (this.audioPlayer) {
        console.log("存在");
        if (url === this.playingURL) {
          console.log("播放的是同一个");
          // 不暂停，继续播放
          this.audioPlayer.play(this.playerId);
        } else {
          // 播放非当前的音频，
          // 需要暂停当前播放
          if (this.audioPlayer.playing(this.playerId)) {
            this.audioPlayer.stop(this.playerId);
          }
          console.log("播放的url：", url);
          this.audioPlayer = new Howl({
            src: [url],
            preload: true,
            onplayerror: function () {
              console.log("播放错误");
              cb({
                code: 1
              });
            },
            onloaderror: function () {
              console.log("loaderror");
              cb({
                code: 1
              });
            }
          });
          this.playerId = this.audioPlayer.play();
          this.playingURL = url;
        }
      } else {
        console.log("new player");
        console.log("播放的url：", url);
        this.audioPlayer = new Howl({
          src: [url],
          preload: true,
          onplayerror: function () {
            console.log("播放错误");
            cb({
              code: 1
            });
          },
          onloaderror: function () {
            console.log("loaderror");
            cb({
              code: 1
            });
          }
        });
        console.log("start load");
        console.log(this.audioPlayer);
        this.playerId = this.audioPlayer.play();
        this.playingURL = url;
      }

      this.audioPlayer.on("end", () => {
        this.audioPlayer = null;
        this.playerId = null;
        this.playingURL = null;
        console.log("play audio finished");
        cb({
          code: 0
        });
      });
      return;
    }
  }
  /**
   * 停止音频播放
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  stopAudio(cb) {
    cb = once(cb);
    console.log("stop audio");
    if (!isApp) {
      // 只有正在播放，才可以停止
      if (this.playerId && this.audioPlayer.playing(this.playerId)) {
        console.log("stop,reset player");
        this.audioPlayer.stop(this.playerId);
      }
      this.audioPlayer = null;
      this.playerId = null;
      this.playingURL = null;
      console.log("执行code 0 回调");
      cb({
        code: 0
      });
      return;
    }
    // 模拟APP调用
    setTimeout(() => cb({
      code: 0
    }), 20);
    this._call("stopAudio", JSON.stringify({}), cb);
  }
  /**
   * 暂停音频播放
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  pauseAudio(cb) {
    cb = once(cb);
    console.log("pause audio");
    if (!isApp) {
      // 只有正在播放，才可以停止
      if (this.playerId && this.audioPlayer.playing(this.playerId)) {
        this.audioPlayer.pause(this.playerId);
      }
      console.log("执行code 0 回调");
      cb({
        code: 0
      });
      return;
    }

    // 模拟APP调用
    setTimeout(() => cb({
      code: 0
    }), 20);
    this._call("pauseAudio", JSON.stringify({}), cb);
  }
  /**
   * 初始化sdk，该初始化和录音功能相关，与其它功能无关
   * 所以，只要涉及录音，就需要初始化
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  initSDK(cb) {
    this._call(
      "initSDK",
      JSON.stringify({
        course_id: this.unitID
      }),
      cb
    );
  }
  /**
   * 点击返回关闭整个webview
   * @return {void} 无
   */
  closePage() {
    this.getBackFn("2");
  }
  /**
  * 交给前端处理返回
  * 目前前端处理的返回是用的 history.back，当然也可自定义其他
  * @param {function} cb 回调函数，接受来自app回传的参数
  * @return {void} 无
  */
  regGetBack(cb) {
    this.registry("getBack", cb);
    this.getBackFn("1");
  }
  /**
   * 返回，目前分为关闭整个webview（2）、交给前端处理（1）、APP默认逐级返回（0）三种情形
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  getBackFn(type) {
    console.log('type is:',type);
    this._call(
      "registeredGetBack",
      JSON.stringify({
        func: "getBack",
        type: type || "0" // 0为默认，一般不会出现；1为需要前端注册返回回调的情形；2为close window
      })
    );
  }

  /**
   * 唤起微信，以便用户绑定微信账号
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  invokeBindingWeChat(cb) {
    if (!isApp) {
      console.log("invokeBindingWeChat");
      cb();
    }
    this._call("invokeBindingWeChat", JSON.stringify({}), function (res) {
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
      cb(res);
    });
  }
  /**
   * 唤起微信，关注公众号
   * @param {object} data 相关信息 {name: '公众号名称'}
   * @param {function} cb 回调函数，接受来自app回传的参数
   * @return {void} 无
   */
  invokeBindingWeChatOfficialAccount(data, cb) {
    if (!isApp) {
      console.log("invokeBindingWeChatOfficialAccount");
      cb();
    }
    this._call("invokeBindingWeChatOfficialAccount", JSON.stringify(data), function (res) {
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
      cb(res);
    });
  }
  /**
   * 去APP的微信里绑定关注公众号
   * 若不在app内部，则自动跳转
   * @param {string} url 去关注的地址
   * @param {function} cb 回调函数，接受来自app回传的参数，目前没啥作用
   * @return {void} 无
   */
  gotoBindingWeChatAccount(url, cb) {
    if (!isApp) {
      window.location.href = url;
    }
    this._call('gotoBindingWeChatAccount', JSON.stringify(url), res => {
      if (cb && typeof cb === 'function') {
        if (typeof res === "string") {
          res = JSON.parse(res);
        }
        cb(res);
      }
    });
  }
  /**
   * 去APP的在线客服
   * 若不在app内部，则自动跳转
   * @param {string} url 去关注的地址
   * @param {function} cb 回调函数，接受来自app回传的参数，目前没啥作用
   * @return {void} 无
   */
  gotoBindOnlineSevice(url, cb) {
    if (!isApp) {
      window.location.href = url;
    }
    this._call('gotoBindOnlineSevice', JSON.stringify(url), res => {
      if (cb && typeof cb === 'function') {
        if (typeof res === "string") {
          res = JSON.parse(res);
        }
        cb(res);
      }
    });
  }
}

export default JSBridge;