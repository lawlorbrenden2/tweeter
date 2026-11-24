// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { StatusDAO } from "../dao/StatusDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { AuthService } from "./AuthService";

export class StatusService implements Service {
  private readonly statusDAO: StatusDAO;
  private readonly followDAO: FollowDAO;
  private readonly authService: AuthService;

  constructor(factory: DAOFactory) {
    this.statusDAO = factory.getStatusDAO();
    this.followDAO = factory.getFollowDAO();
    this.authService = new AuthService(factory.getAuthDAO());
  }

  public async postStatus(token: string, statusDto: StatusDto): Promise<void> {
    const authorAlias = await this.authService.validateToken(token);
    if (statusDto.user.alias !== authorAlias) {
      throw new Error("[unauthorized] Status author does not match auth token");
    }

    await this.statusDAO.putStory(statusDto);

    let lastFollowerAlias: string | undefined;
    let hasMore: boolean;
    do {
      const [followerAliases, moreFollowers] = await this.followDAO.getPageOfFollowers(
        statusDto.user.alias,
        25,
        lastFollowerAlias,
      );
      if (followerAliases.length > 0) {
        await this.statusDAO.putFeedBatch(followerAliases, statusDto);
        lastFollowerAlias = followerAliases[followerAliases.length - 1];
      }
      hasMore = moreFollowers;
    } while (hasMore);
  }

  public async getStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    return this.statusDAO.getPageOfStory(
      userAlias,
      pageSize,
      lastItem?.timestamp,
    );
  }

  public async getFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.validateToken(token);
    return this.statusDAO.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem?.timestamp,
    );
  }
}
