// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthDAO } from "../dao/AuthDAO";

export class FollowService implements Service {
  private readonly followDAO: FollowDAO;
  private readonly userDAO: UserDAO;
  private readonly authDAO: AuthDAO;
  private readonly authTokenTimeout = 30 * 60 * 1000;

  constructor(factory: DAOFactory) {
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
    this.authDAO = factory.getAuthDAO();
  }
  
  public async getFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(token);
    const [aliases, hasMore] = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias,
    );
    const records = await Promise.all(aliases.map((alias) => this.userDAO.getUser(alias)));
    const users = records.flatMap((record) => record ? [record.user] : []);
    return [users, hasMore];
  }

  public async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(token);
    const [aliases, hasMore] = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias,
    );
    const records = await Promise.all(aliases.map((alias) => this.userDAO.getUser(alias)));
    const users = records.flatMap((record) => record ? [record.user] : []);
    return [users, hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    await this.validateToken(token);
    return this.followDAO.getFollow(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.validateToken(token);
    return this.userDAO.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.validateToken(token);
    return this.userDAO.getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userToFollow: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.validateToken(token);
    if (!(await this.followDAO.getFollow(followerAlias, userToFollow))) {
      await this.followDAO.putFollow(followerAlias, userToFollow);
      await this.userDAO.updateFolloweeCount(followerAlias, 1);
      await this.userDAO.updateFollowerCount(userToFollow, 1);
    }

    const followerCount = await this.userDAO.getFollowerCount(userToFollow);
    const followeeCount = await this.userDAO.getFolloweeCount(userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.validateToken(token);
    if (await this.followDAO.getFollow(followerAlias, userToUnfollow)) {
      await this.followDAO.deleteFollow(followerAlias, userToUnfollow);
      await this.userDAO.updateFolloweeCount(followerAlias, -1);
      await this.userDAO.updateFollowerCount(userToUnfollow, -1);
    }

    const followerCount = await this.userDAO.getFollowerCount(userToUnfollow);
    const followeeCount = await this.userDAO.getFolloweeCount(userToUnfollow);

    return [followerCount, followeeCount];
  }

  private async validateToken(token: string): Promise<string> {
    const record = await this.authDAO.getAuthToken(token);
    if (record === null) {
      throw new Error("[unauthorized] Invalid auth token");
    }

    const now = Date.now();
    if (now - record.authToken.timestamp > this.authTokenTimeout) {
      await this.authDAO.deleteAuthToken(token);
      throw new Error("[unauthorized] Auth token expired");
    }

    await this.authDAO.updateAuthToken(token, now);
    return record.alias;
  }
}
