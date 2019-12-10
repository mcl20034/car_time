import AppointStore from './appointStore';
class RootStore {
    constructor() {
        this.appointStore = new AppointStore(this);
    }
}

export default new RootStore();
