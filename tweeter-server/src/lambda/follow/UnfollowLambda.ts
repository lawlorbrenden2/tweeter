// AI-assisted: see AI-ATTRIBUTION.md
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

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
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      /^\[(bad-request|unauthorized|internal-server-error)\]/.test(
        error.message,
      )
    ) {
      throw error;
    }
    throw new Error("[internal-server-error]");
  }
};