// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  FollowCountRequest,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  TweeterResponse,
  UnfollowRequest,
  UnfollowResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private checkResponseForErrors(response: TweeterResponse): void {
    if (!response.success) {
      const errorResponse = response as TweeterResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ??
          errorResponse.error ??
          errorResponse.errorMessage ??
          "Unknown Server Error",
      );
    }
  }

  private SERVER_URL =
    "https://1d38tnplx5.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/register");

    this.checkResponseForErrors(response);

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);
    if (user === null || authToken === null) {
      throw new Error(
        "Invalid registration response: missing user or authToken",
      );
    }

    return [user, authToken];
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");

    this.checkResponseForErrors(response);

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);
    if (user === null || authToken === null) {
      throw new Error("Invalid login response: missing user or authToken");
    }

    return [user, authToken];
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/logout");

    this.checkResponseForErrors(response);
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getUser");

    this.checkResponseForErrors(response);

    return User.fromDto(response.user);
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/postStatus");

    this.checkResponseForErrors(response);
  }

  public async follow(request: FollowRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    this.checkResponseForErrors(response);
  }

  public async unfollow(request: UnfollowRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/unfollow");

    this.checkResponseForErrors(response);
  }

  public async getFolloweeCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/getFolloweeCount");

    this.checkResponseForErrors(response);
    if (!Number.isInteger(response.count) || response.count < 0) {
      throw new Error("No valid followee count returned");
    }

    return response.count;
  }

  public async getFollowerCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/getFollowerCount");

    this.checkResponseForErrors(response);
    if (!Number.isInteger(response.count) || response.count < 0) {
      throw new Error("No valid follower count returned");
    }

    return response.count;
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest,
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/getIsFollowerStatus");

    this.checkResponseForErrors(response);
    if (typeof response.isFollower !== "boolean") {
      throw new Error("No follower status returned");
    }

    return response.isFollower;
  }

  public async getFeedItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/getFeedItems");

    this.checkResponseForErrors(response);
    if (response.items == null) {
      throw new Error("No feed items found");
    }

    const items = response.items.map((dto) => Status.fromDto(dto) as Status);
    return [items, response.hasMore];
  }

  public async getStoryItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/getStoryItems");

    this.checkResponseForErrors(response);
    if (response.items == null) {
      throw new Error("No story items found");
    }

    const items = response.items.map((dto) => Status.fromDto(dto) as Status);
    return [items, response.hasMore];
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getFollowers");

    this.checkResponseForErrors(response);
    if (response.items == null) {
      throw new Error("No followers found");
    }

    const items = response.items.map((dto) => User.fromDto(dto) as User);
    return [items, response.hasMore];
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/getFollowees");

    this.checkResponseForErrors(response);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (items == null) {
      throw new Error(`No followees found`);
    } else {
      return [items, response.hasMore];
    }
  }
}
