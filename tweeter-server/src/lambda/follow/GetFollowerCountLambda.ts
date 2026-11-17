// AI-assisted: see AI-ATTRIBUTION.md
import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

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