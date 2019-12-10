/**
 * 页面非点击事件，使用__m_static_jsv全局变量
 * 可以避免发送冗余请求
 */
function initPindData() {
  var initData = null;
  if (typeof __m_static_jsv !== 'undefined') {
    if (typeof __m_static_jsv === 'string') {
      initData = JSON.parse(__m_static_jsv);
    } else if (typeof __m_static_jsv === 'object') {
      initData = __m_static_jsv;
    }
    window.global_ping_data = { t: initData.t };
    console.log('window global_ping_data:');
    console.log(window.global_ping_data);
  }
}

/**
 * 增加公共参数，页面引用时单独传递。
 * @param {object}  global_params
 */
function add_params(global_params) {
  // console.log("global_params-----",global_params)
  if (typeof global_params === 'object') {
    window.global_ping_data = global_params; //公共参数
  } else {
    console.log("公共参数必须为object类型")
  }
};

/**
 * 将函数增加到window.onload
 * @param {string} func 函数名
 */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      oldonload();
      func();
    }
  }
}

/**
 * 给所有带data-analytics的元素，添加埋点click事件
 */
function add_click() {
  var body = document.getElementsByTagName("body")[0]
  if (body.addEventListener)
    body.addEventListener("click", function (e) {
      select_data(e.target || e.srcElement);
    });
  if (body.attachEvent)
    body.attachEvent("onclick", function (e) {
      select_data(e.target || e.srcElement);
    });
}
/**
 * 查找带有data-analytics属性的节点，获取埋点值
 * @param {object} target 鼠标点击事件的target     
 */
function select_data(target) {
  // console.log(target)
  if (target.getAttribute('data-analytics')) {
    pind_send(target.getAttribute('data-analytics'));
  } else {
    return;
  }
}
/**
 * 调用pind.js的发送埋点数据方法 本方法可以被手动调用  参见README.md
 * @param {string} data_params  埋点值
 */
function pind_send(data_params) {
  // console.log("调用",data_params)
  if (typeof data_params === 'string') { // 转为json
    data_params = (new Function("return " + data_params))();
  }
  try {
    let param = Object.assign(window.global_ping_data, { v: data_params });
    console.log('param is:', JSON.stringify(param));
    console.log(typeof __sdonclick);
    if (!isExitsFunction('__sdonclick')) {
      console.warn("未找到pind.js的__sdonclick方法")
    } else {
      __sdonclick(JSON.stringify(param));
    }
  } catch (error) {
    console.log(error)
  }
}
/**
 * 判断函数是否存在
 * @param {string} funcName  函数名称
 */
function isExitsFunction(funcName) {
  try {
    if (typeof (eval(funcName)) == "function") {
      return true;
    }
  } catch (e) { }
  return false;
}
addLoadEvent(initPindData);
addLoadEvent(add_click);
export { pind_send, add_params }