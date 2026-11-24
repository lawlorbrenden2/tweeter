// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { StatusDAO } from "../dao/StatusDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { AuthDAO } from "../dao/AuthDAO";

export class StatusService implements Service {
  private readonly statusDAO: StatusDAO;
  private readonly followDAO: FollowDAO;
  private readonly authDAO: AuthDAO;
  private readonly authTokenTimeout = 30 * 60 * 1000;

  constructor(factory: DAOFactory) {
    this.statusDAO = factory.getStatusDAO();
    this.followDAO = factory.getFollowDAO();
    this.authDAO = factory.getAuthDAO();
  }

  public async postStatus(token: string, statusDto: StatusDto): Promise<void> {
    const authorAlias = await this.validateToken(token);
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
    await this.validateToken(token);
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
    await this.validateToken(token);
    return this.statusDAO.getPageOfFeed(
      userAlias,
      pageSize,
      lastItem?.timestamp,
    );
  }

  private async validateToken(token: string): Promise<string> {
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
