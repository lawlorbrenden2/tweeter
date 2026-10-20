import { AuthToken } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
  private statusService: StatusService;

  public constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
  }
  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doStatusItemOperation(
      () =>
        this.statusService.getFeedItems(
          authToken,
          userAlias,
          PAGE_SIZE,
          this.lastItem,
        ),
      "load feed",
    );
  }
}
