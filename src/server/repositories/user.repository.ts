import type { User } from "@/domain";
import { users } from "@/server/data/users";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  /** The demo's "current" user (mock auth). Returns the first seed user. */
  findDemoUser(): Promise<User>;
}

export class MockUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return users.find((u) => u.id === id) ?? null;
  }

  async findDemoUser(): Promise<User> {
    return users[0];
  }
}
