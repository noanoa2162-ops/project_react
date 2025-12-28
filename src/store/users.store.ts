import { makeAutoObservable } from "mobx";
import type { User } from "../models";

class UsersStore {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsers(users: User[]) {
    this.users = users;
  }


  // קבל שם משתמש לפי ID
  getUserNameById(userId: number | null): string {
    if (!userId) return "לא מוקצה";
    const user = this.users.find(u => u.id === userId);
    return user?.name || `משתמש #${userId}`;
  }

  // קבל משתמש לפי ID
  getUserById(userId: number | null): User | undefined {
    return this.users.find(u => u.id === userId);
  }
}

export default new UsersStore();
