import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model.service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
  // protected async doStatusItemOperation(
  //   operation: () => Promise<[Status[], boolean]>,
  //   operationDescription: string
  // ) {
  //   await this.doFailureReportingOperation(async () => {
  //     const [newItems, hasMore] = await operation();

  //     this.hasMoreItems = hasMore;
  //     this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
  //     this.view.addItems(newItems);
  //   }, operationDescription);
  // }
}
