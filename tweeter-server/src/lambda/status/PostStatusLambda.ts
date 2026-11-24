// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

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
    const statusService = new StatusService(new DynamoDAOFactory());
    await statusService.postStatus(request.token, request.status);

    return {
      success: true,
      message: null,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};