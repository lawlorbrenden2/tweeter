import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService = new StatusService();

  public async submitPost(
    authToken: AuthToken,
    post: string,
    currentUser: User,
  ) {
    let postingStatusToastId = "";

    this.view.setIsLoading(true);
    postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

    await this.doFailureReportingOperation(async () => {
      const status = new Status(post, currentUser!, Date.now());
      await this._statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.deleteMessage(postingStatusToastId);
    this.view.setIsLoading(false);
  }
}
