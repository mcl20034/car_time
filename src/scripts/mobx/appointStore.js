import { observable, action, computed } from 'mobx';
import BaseStore from './base';
import _ from 'lodash';
import Service from '../services/coursesService';
const service = new Service();
export default class AppointStore extends BaseStore {
    @observable selectList = [];
    @observable coursesData = {}
    @observable modalSelect = [];
    @action
    closeItem = async (index) => {
        this.selectList.splice(index, 1);
    }

    @action
    syncModalSelect = () => {
        this.modalSelect.push(...this.selectList)
    }

    @action
    clearModalSelect = () => {
        this.modalSelect = [];
    }

    @action
    getItemInList = (week, slot) => {
        let list = _.filter(this.modalSelect, (item) => {
            return item.weekSlot === (week.week_num + '_' + slot.slot)
        });
        if (list.length > 0) {
            return true
        }
        return false
    }

    @action
    addItem = (week, slot, regular) => {
        if (this.getItemInList(week, slot)) {
            let newList = _.filter(this.modalSelect, (item) => {
                return item.weekSlot !== (week.week_num + '_' + slot.slot)
            });
            this.modalSelect = newList
        } else if (this.modalSelect.length >= this.coursesData.max_slots) {
            this.showToast('超出每周上限');
            return
        } else {
            let newList = this.modalSelect.slice(0, this.modalSelect.length)
            newList.push({
                week_num: week.week_num,
                week: week.week,
                slot: slot.slot,
                time: slot.time,
                weekSlot: week.week_num + '_' + slot.slot,
                regular: regular
            });
            this.modalSelect = newList
        }
    }

    @computed get getCanSave() {
        let have = false;
        if (Array.isArray(this.modalSelect) && this.modalSelect.length > 0) {
            have = true;
        }
        return have;
    }

    @computed get getHaveSelected() {
        let have = false;
        if (Array.isArray(this.selectList) && this.selectList.length > 0) {
            have = true;
        }
        return have;
    }

    @action
    getDetail = () => {
        // service.getDetail({
        //     userId: 1
        // }).then((res) => {
        //     console.log('console log to chrome res', res);
        //     if (res.code == 10000) {
        //         this.coursesData = _.get(res, 'res', {});
        //         let userSlots = _.get(res, 'res.user_slots', []);
        //         let selectList = [];
        //         _.forEach(userSlots, (item, index) => {
        //             item.weekSlot = item.week_num + '_' + item.slot
        //             item.week = item.week.replace('每', '');
        //             selectList.push(item);
        //         });
        //         this.selectList = selectList;
        //     } else {
        //         this.showToast(res.message);
        //     }
        // }).catch((err) => {
        //     this.showToast('网络连接失败，请稍后再试');
        // });
    }

}
