// AI-assisted: see AI-ATTRIBUTION.md
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
    request: PagedUserItemRequest,
): Promise<PagedUserItemResponse & { headers: Record<string, string> }> => {
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
        const followService = new FollowService();
        const [items, hasMore] = await followService.getFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);

        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore,
            headers: { "Access-Control-Allow-Origin": "*" },
        };
    } catch (error: unknown) {
        if (error instanceof Error && /^\[(bad-request|unauthorized|internal-server-error)\]/.test(error.message)) {
            throw error;
        }
        throw new Error("[internal-server-error]");
    }
};