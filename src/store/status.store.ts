import { makeAutoObservable } from "mobx";
import type { Status } from "../models";

class StatusStore {
    statuses: Status[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setStatuses(statuses: Status[]) {
        this.statuses = [...statuses];
    }

    addStatus(status: Status) {
        this.statuses.push(status);
    }
}

const statusesStore = new StatusStore();
export default statusesStore;
