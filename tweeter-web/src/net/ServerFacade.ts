// AI-assisted: see AI-ATTRIBUTION.md
import {
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://1d38tnplx5.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

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