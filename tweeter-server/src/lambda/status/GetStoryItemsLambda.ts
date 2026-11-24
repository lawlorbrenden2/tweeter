// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (
  request: PagedStatusItemRequest,
): Promise<PagedStatusItemResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userAlias) {
    throw new Error("[bad-request] missing userAlias");
  }
  if (!Number.isInteger(request.pageSize) || request.pageSize <= 0) {
    throw new Error("[bad-request] pageSize must be a positive integer");
  }
  try {
    const statusService = new StatusService(new DynamoDAOFactory());
    const [items, hasMore] = await statusService.getStoryItems(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem,
    );

    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};