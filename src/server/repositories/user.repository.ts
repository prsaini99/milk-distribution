import type { User } from "@/domain";
import { userStore } from "@/server/data/users.store";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  /** The demo's "current" user (mock auth). Returns the first seed user. */
  findDemoUser(): Promise<User>;
  update(id: string, patch: Partial<User>): Promise<User | null>;
}

export class MockUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return userStore.find((u) => u.id === id) ?? null;
  }

  async findDemoUser(): Promise<User> {
    return userStore[0];
  }

  async update(id: string, patch: Partial<User>): Promise<User | null> {
    const user = userStore.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, patch, { id: user.id }); // id is immutable
    return user;
  }
}
