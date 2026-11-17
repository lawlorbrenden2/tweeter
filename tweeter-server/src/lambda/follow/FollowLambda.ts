// AI-assisted: see AI-ATTRIBUTION.md
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";

export const handler = async (
  request: FollowRequest,
): Promise<FollowResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userToFollow) {
    throw new Error("[bad-request] missing userToFollow");
  }
  try {
    const followService = new FollowService();
    await followService.follow(request.token, request.userToFollow);

    return {
      success: true,
      message: null,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};