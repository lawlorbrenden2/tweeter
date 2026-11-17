// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(token: string, userAlias: string): Promise<UserDto | null> {
    return FakeData.instance.findUserByAlias(userAlias)?.dto ?? null;
  }
}