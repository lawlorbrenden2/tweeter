// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { handleError, CORS_HEADERS } from "../../util/ServerUtil";

export const handler = async (
  request: LoginRequest,
): Promise<LoginResponse & { headers: Record<string, string> }> => {
  if (!request?.alias) {
    throw new Error("[bad-request] missing alias");
  }
  if (!request.password) {
    throw new Error("[bad-request] missing password");
  }
  try {
    const userService = new UserService();
    const [user, authToken] = await userService.login(request.alias, request.password);

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken,
      headers: CORS_HEADERS,
    };
  } catch (error: unknown) {
    handleError(error);
  }
};