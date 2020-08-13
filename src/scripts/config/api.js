//api 配置
export default {
  login: `login.html?tt=${new Date().getTime()}`, // test
  ValidateImageServlet: `servlet/ValidateImageServlet.html?r=${new Date().getTime()}`, // test
  fullperiod: `kline/fullperiod.html?r=${new Date().getTime()}`, // test
  send_sms: `user/send_sms.html?r=${new Date().getTime()}`, // test
  send_reg_email: `user/send_reg_email.html?r=${new Date().getTime()}`, // test
  register: `register?r=${new Date().getTime()}`, // test
  getIndexInfoPrice: `real/getIndexInfoPrice.html?r=${new Date().getTime()}`, // test
  get_sign: `v2/carTimeMp/wx-auth/get-sign`,
  get_auth_url: `v2/carTimeMp/wx-auth/get-auth-url`,
  get_user: `v2/carTimeMp/wx-auth/code-2-user`,
  get_brand: `v2/carTimeMp/dealer/brand-list`,
  company_register: `v2/carTimeMp/dealer/register`,
  ks_resgister: `v2/carTimeMp/dealer/register-ks-info`,
};
