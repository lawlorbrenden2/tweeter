import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LogoutView {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (toastID: string) => void;
  clearUserInfo: () => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LogoutPresenter {
  private _view: LogoutView;
  private _userService: UserService;

  public constructor(view: LogoutView) {
    this._view = view;
    this._userService = new UserService();
  }
  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0);

    try {
      await this._userService.logout(authToken);

      this._view.deleteMessage(loggingOutToastId);
      this._view.clearUserInfo();
      this._view.navigate("/login");
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
