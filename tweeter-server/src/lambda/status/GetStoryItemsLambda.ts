// AI-assisted: see AI-ATTRIBUTION.md
import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

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
    const statusService = new StatusService();
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