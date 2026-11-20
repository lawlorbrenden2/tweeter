// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";

export class StatusService implements Service {
  constructor(factory: DAOFactory) {
    this.statusDAO = factory.getStatusDAO();
    this.followDAO = factory.getFollowDAO();
    this.authDAO = factory.getAuthDAO();
  }

  public async postStatus(token: string, statusDto: StatusDto): Promise<void> {
    // Simulate a successful post without persisting the status.
    return;
  }

  public async getStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [items.map((status) => status.dto), hasMore];
  }

  public async getFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [items.map((status) => status.dto), hasMore];
  }
}
