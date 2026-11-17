// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

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