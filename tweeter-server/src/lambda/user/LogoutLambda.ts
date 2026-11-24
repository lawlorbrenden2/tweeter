// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (
  request: LogoutRequest,
): Promise<LogoutResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  try {
    const userService = new UserService(new DynamoDAOFactory())
    await userService.logout(request.token);

    return {
      success: true,
      message: null,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};