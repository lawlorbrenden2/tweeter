import { AuthTokenDto } from "tweeter-shared";

export interface AuthDAO {
  putAuthToken(token: AuthTokenDto, alias: string): Promise<void>;
  getAuthToken(token: string): Promise<{ authToken: AuthTokenDto; alias: string } | null>;
  updateAuthToken(token: string, newTimestamp: number): Promise<void>;
  deleteAuthToken(token: string): Promise<void>;
}