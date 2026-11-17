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
  UnfollowRequest,
  UnfollowResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://1d38tnplx5.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/register");

    if (!response.success) {
      const errorResponse = response as RegisterResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }

    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);
    if (user === null || authToken === null) {
      throw new Error("Invalid registration response: missing user or authToken");
    }

    return [user, authToken];
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");

    if (!response.success) {
      const errorResponse = response as LoginResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }

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

    if (!response.success) {
      const errorResponse = response as LogoutResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getUser");

    if (!response.success) {
      const errorResponse = response as GetUserResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }

    return User.fromDto(response.user);
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/postStatus");

    if (!response.success) {
      const errorResponse = response as PostStatusResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
  }

  public async follow(request: FollowRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    if (!response.success) {
      const errorResponse = response as FollowResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
  }

  public async unfollow(request: UnfollowRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/unfollow");

    if (!response.success) {
      const errorResponse = response as UnfollowResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
  }

  public async getFolloweeCount(
    request: FollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/getFolloweeCount");

    if (!response.success) {
      const errorResponse = response as FollowCountResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
    if (!Number.isInteger(response.count) || response.count < 0) {
      throw new Error("No valid followee count returned");
    }

    return response.count;
  }

  public async getFollowerCount(
    request: FollowCountRequest,
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/getFollowerCount");

    if (!response.success) {
      const errorResponse = response as FollowCountResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
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

    if (!response.success) {
      const errorResponse = response as IsFollowerResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
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

    if (!response.success) {
      const errorResponse = response as PagedStatusItemResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
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

    if (!response.success) {
      const errorResponse = response as PagedStatusItemResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
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

    if (!response.success) {
      const errorResponse = response as PagedUserItemResponse & {
        error?: string;
        errorMessage?: string;
      };
      throw new Error(
        response.message ?? errorResponse.error ?? errorResponse.errorMessage ?? "Unknown Server Error",
      );
    }
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

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      const errorMsg = response.message ?? (response as any).errorMessage ?? "Unknown Server Error";
      throw new Error(errorMsg);
    }
  }
}