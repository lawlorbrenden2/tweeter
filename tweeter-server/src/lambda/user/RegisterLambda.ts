// AI-assisted: see AI-ATTRIBUTION.md
import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest,
): Promise<RegisterResponse & { headers: Record<string, string> }> => {
  if (!request?.firstName) {
    throw new Error("[bad-request] missing firstName");
  }
  if (!request.lastName) {
    throw new Error("[bad-request] missing lastName");
  }
  if (!request.alias) {
    throw new Error("[bad-request] missing alias");
  }
  if (!request.password) {
    throw new Error("[bad-request] missing password");
  }
  if (!request.userImageBytes) {
    throw new Error("[bad-request] missing userImageBytes");
  }
  if (!request.imageFileExtension) {
    throw new Error("[bad-request] missing imageFileExtension");
  }
  try {
    const userService = new UserService();
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension,
    );

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