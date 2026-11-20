import { UserDto } from "tweeter-shared";

export interface UserDAO {
  putUser(user: UserDto, passwordHash: string): Promise<void>;
  getUser(alias: string): Promise<{ user: UserDto; passwordHash: string } | null>;
  updateFollowerCount(alias: string, delta: number): Promise<void>;
  updateFolloweeCount(alias: string, delta: number): Promise<void>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
}