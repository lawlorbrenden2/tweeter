// AI-assisted: see AI-ATTRIBUTION.md
import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";

export const handler = async (
  request: GetUserRequest,
): Promise<GetUserResponse & { headers: Record<string, string> }> => {
  if (!request?.token) {
    throw new Error("[bad-request] missing token");
  }
  if (!request.userAlias) {
    throw new Error("[bad-request] missing userAlias");
  }
  try {
    const userService = new UserService(new DynamoDAOFactory());
    const user = await userService.getUser(request.token, request.userAlias);

    return {
      success: true,
      message: null,
      user: user,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};