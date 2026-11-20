// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";

export class UserService implements Service {

  constructor(factory: DAOFactory) {
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
    this.authDAO = factory.getAuthDAO();
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("[internal-server-error] Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

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

  public async logout(token: string): Promise<void> {
    return;
  }

  public async getUser(token: string, userAlias: string): Promise<UserDto | null> {
    return FakeData.instance.findUserByAlias(userAlias)?.dto ?? null;
  }
}