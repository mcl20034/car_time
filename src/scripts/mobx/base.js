import { observable, action } from 'mobx';
export const LOADING = 'LOADING_STATUS';
export const NULL = 'NULL_STATUS';
export const ERROR = 'ERROR_STATUS';
import Toast from '../components/toast/index';
export default class BaseStore {

  @observable screenStatus = '';

  @action
  dataLoading() {
    this.screenStatus = LOADING;
  }
  @action
  dataNull() {
    this.screenStatus = NULL;
  }
  @action
  dataError() {
    this.screenStatus = ERROR;
  }
  @action
  dataSuccess() {
    this.screenStatus = '';
  }
  @action
  showToast(message) {
    Toast.info(message, 1200);
  }
}
