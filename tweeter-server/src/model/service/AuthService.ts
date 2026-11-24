// AI-assisted: see AI-ATTRIBUTION.md
import { AuthDAO } from "../dao/AuthDAO";

export class AuthService {
  private readonly authTokenTimeout = 30 * 60 * 1000;

  constructor(private readonly authDAO: AuthDAO) {}

  public async validateToken(token: string): Promise<string> {
    const record = await this.authDAO.getAuthToken(token);
    if (record === null) {
      throw new Error("[unauthorized] Invalid auth token");
    }

    const now = Date.now();
    if (now - record.authToken.timestamp > this.authTokenTimeout) {
      await this.authDAO.deleteAuthToken(token);
      throw new Error("[unauthorized] Auth token expired");
    }

    await this.authDAO.updateAuthToken(token, now);
    return record.alias;
  }
}