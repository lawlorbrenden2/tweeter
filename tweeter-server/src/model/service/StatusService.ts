// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
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