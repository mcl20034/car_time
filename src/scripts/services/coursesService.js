'use strict';
import BaseService from "./base";
/**
 * 页面信息描述
 * @class
 * @extends {BaseService}
 */
export default class CoursesService extends BaseService {
  /**
   * 构造函数
   * @return {Void} 无
   */
  constructor() {
    super();
  }
  /**
   * 获取版本号
   * @param {Object} data 
   * data数据描述：
   * {
   *  book_id	true	普通参数	int	1	教材id
   * }
   * @return {any} 返回列表信息
   */
  async getDetail(data) {
    return this.getData('getDetail', data);
  }
}