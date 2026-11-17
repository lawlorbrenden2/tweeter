// AI-assisted: see AI-ATTRIBUTION.md
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";

export const handler = async (
  request: UnfollowRequest,
): Promise<UnfollowResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userToUnfollow) {
    throw new Error("[bad-request] missing userToUnfollow");
  }
  try {
    const followService = new FollowService();
    await followService.unfollow(request.token, request.userToUnfollow);

    return {
      success: true,
      message: null,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};