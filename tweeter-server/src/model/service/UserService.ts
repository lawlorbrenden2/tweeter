// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import * as bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { UserDAO } from "../dao/UserDAO";
import { AuthDAO } from "../dao/AuthDAO";
import { ImageDAO } from "../dao/ImageDAO";
import { AuthService } from "./AuthService";

export class UserService implements Service {
  private readonly userDAO: UserDAO;
  private readonly authDAO: AuthDAO;
  private readonly imageDAO: ImageDAO;
  private readonly authService: AuthService;

  constructor(factory: DAOFactory) {
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
    this.authDAO = factory.getAuthDAO();
    this.authService = new AuthService(this.authDAO);
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    if (await this.userDAO.getUser(alias)) {
      throw new Error("[bad-request] Alias already exists");
    }

    const fileName = `${alias}-${uuid()}.${imageFileExtension.replace(/^\./, "")}`;
    const imageUrl = await this.imageDAO.putImage(fileName, userImageBytes);
    const passwordHash = await bcrypt.hash(password, 10);
    const userDto: UserDto = { firstName, lastName, alias, imageUrl };
    await this.userDAO.putUser(userDto, passwordHash);

    const authToken = AuthToken.Generate();
    await this.authDAO.putAuthToken(authToken.dto, alias);
    return [userDto, authToken.dto];
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const record = await this.userDAO.getUser(alias);
    if (record === null || !(await bcrypt.compare(password, record.passwordHash))) {
      throw new Error("[unauthorized] Invalid alias or password");
    }

    const authToken = AuthToken.Generate();
    await this.authDAO.putAuthToken(authToken.dto, alias);
    return [record.user, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    await this.authDAO.deleteAuthToken(token);
  }

  public async getUser(token: string, userAlias: string): Promise<UserDto | null> {
    await this.authService.validateToken(token);
    const userRecord = await this.userDAO.getUser(userAlias);
    return userRecord ? userRecord.user : null;
  }
}