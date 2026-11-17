// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status, PagedStatusItemRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async getFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.getFeedItems(request);
  }

  public async getStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return await this.serverFacade.getStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
