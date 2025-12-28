import { makeAutoObservable } from "mobx";
import type { Priority } from "../models";

class PrioritiesStore {
    priorities: Priority[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setPriorities(priorities: Priority[]) {
        this.priorities = [...priorities];
    }

    addPriority(priority: Priority) {
        this.priorities.push(priority);
    }
}

const prioritiesStore = new PrioritiesStore();
export default prioritiesStore;
