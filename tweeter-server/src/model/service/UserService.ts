// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("[unauthorized] Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async getUser(token: string, userAlias: string): Promise<UserDto | null> {
    return FakeData.instance.findUserByAlias(userAlias)?.dto ?? null;
  }
}