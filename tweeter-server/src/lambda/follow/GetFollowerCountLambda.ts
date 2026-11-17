// AI-assisted: see AI-ATTRIBUTION.md
import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";

export const handler = async (
  request: FollowCountRequest,
): Promise<FollowCountResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userAlias) {
    throw new Error("[bad-request] missing userAlias");
  }
  try {
    const followService = new FollowService();
    const count = await followService.getFollowerCount(
      request.token,
      request.userAlias,
    );

    return {
      success: true,
      message: null,
      count: count,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};