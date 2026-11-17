// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest,
): Promise<PostStatusResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.status) {
    throw new Error("[bad-request] missing status");
  }
  try {
    const statusService = new StatusService();
    await statusService.postStatus(request.token, request.status);

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