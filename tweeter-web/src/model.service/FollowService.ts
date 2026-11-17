// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, FakeData, FollowCountRequest, IsFollowerRequest, PagedUserItemRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

public async getFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };

    return await this.serverFacade.getMoreFollowees(request);
  }

  public async getFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.getMoreFollowers(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    const request: IsFollowerRequest = {
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    };

    return await this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };

    return await this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow,
    );

    return [followerCount, followeeCount];
  }
}
