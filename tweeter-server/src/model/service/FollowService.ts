// AI-assisted: see AI-ATTRIBUTION.md
import { User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";


export class FollowService implements Service {

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
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async getFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  }

  public async follow(
    token: string,
    userToFollow: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollow,
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollow,
    );

    return [followerCount, followeeCount];
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias,
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
