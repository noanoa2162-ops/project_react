import { makeAutoObservable } from "mobx";
import type { User } from "../models";

class AuthStore {
    token: string | null = localStorage.getItem("token");
    currentUser: User | null = null;
    isAuthenticated = !!this.token;
    isLoadingUser = false;

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentUser(user: User) {
        this.currentUser = user;
    }

    setLoadingUser(loading: boolean) {
        this.isLoadingUser = loading;
    }

    login(token: string, user: User) {
        this.token = token;
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem("token", token);
    }

    logout() {
        localStorage.removeItem("token");
        this.token = null;
        this.isAuthenticated = false;
        this.currentUser = null;
    }
}

const authStore = new AuthStore();
export default authStore;   