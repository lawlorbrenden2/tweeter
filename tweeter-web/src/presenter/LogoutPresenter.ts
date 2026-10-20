import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LogoutView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (toastID: string) => void;
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this._userService = new UserService();
  }
  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportingOperation(async () => {
      await this._userService.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
