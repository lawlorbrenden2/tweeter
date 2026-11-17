// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";

export const handler = async (
  request: IsFollowerRequest,
): Promise<IsFollowerResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userAlias) {
    throw new Error("[bad-request] missing userAlias");
  }
  if (!request.selectedUserAlias) {
    throw new Error("[bad-request] missing selectedUserAlias");
  }

  try {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(
      request.token,
      request.userAlias,
      request.selectedUserAlias,
    );

    return {
      success: true,
      message: null,
      isFollower: isFollower,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};