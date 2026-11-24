// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { AuthService } from "./AuthService";

export class FollowService implements Service {
  private readonly followDAO: FollowDAO;
  private readonly userDAO: UserDAO;
  private readonly authService: AuthService;

  constructor(factory: DAOFactory) {
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
    this.authService = new AuthService(factory.getAuthDAO());
  }
  
  public async getFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const [aliases, hasMore] = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias,
    );
    const users = await this.resolveUsers(aliases);
    return [users, hasMore];
  }

  public async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    await this.authService.validateToken(token);
    const [aliases, hasMore] = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias,
    );
    const users = await this.resolveUsers(aliases);
    return [users, hasMore];
  }

  private async resolveUsers(aliases: string[]): Promise<UserDto[]> {
    const records = await Promise.all(aliases.map((alias) => this.userDAO.getUser(alias)));
    return records.flatMap((record) => record ? [record.user] : []);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    await this.authService.validateToken(token);
    return this.followDAO.getFollow(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.userDAO.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.authService.validateToken(token);
    return this.userDAO.getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userToFollow: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authService.validateToken(token);
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
    const followerAlias = await this.authService.validateToken(token);
    if (await this.followDAO.getFollow(followerAlias, userToUnfollow)) {
      await this.followDAO.deleteFollow(followerAlias, userToUnfollow);
      await this.userDAO.updateFolloweeCount(followerAlias, -1);
      await this.userDAO.updateFollowerCount(userToUnfollow, -1);
    }

    const followerCount = await this.userDAO.getFollowerCount(userToUnfollow);
    const followeeCount = await this.userDAO.getFolloweeCount(userToUnfollow);

    return [followerCount, followeeCount];
  }
}
