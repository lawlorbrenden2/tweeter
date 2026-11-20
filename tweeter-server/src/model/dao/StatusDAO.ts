import { StatusDto } from "tweeter-shared";

export interface StatusDAO {
  putStory(status: StatusDto): Promise<void>;
  putFeed(followerAlias: string, status: StatusDto): Promise<void>;
  getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItemTimestamp?: number,
  ): Promise<[StatusDto[], boolean]>;
  getPageOfFeed(
    userAlias: string,
    pageSize: number,
    lastItemTimestamp?: number,
  ): Promise<[StatusDto[], boolean]>;
}
