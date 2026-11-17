// AI-assisted: see AI-ATTRIBUTION.md
export const CORS_HEADERS = { "Access-Control-Allow-Origin": "*" };

export const handleError: (error: unknown) => never = (error: unknown): never => {
  if (
    error instanceof Error &&
    /^\[(bad-request|unauthorized|internal-server-error)\]/.test(
      error.message,
    )
  ) {
    throw error;
  }
  throw new Error("[internal-server-error]");
};