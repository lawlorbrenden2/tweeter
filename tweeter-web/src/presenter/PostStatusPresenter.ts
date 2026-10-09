import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this._statusService = new StatusService();
  }

  protected get view() {
    return this._view;
  }

  protected get statusService() {
    return this._statusService;
  }

  public async submitPost(
    authToken: AuthToken,
    post: string,
    currentUser: User,
  ) {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this._statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }
}
