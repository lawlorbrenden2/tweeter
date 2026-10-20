import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (displayedUser: User) => void;
  navigate: (url: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private _userService = new UserService();

  public constructor(view: UserNavigationView) {
    super(view);
  }

  public async navigateToUser(
    authToken: AuthToken,
    alias: string,
    featurePath: string,
    displayedUser: User | null,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const toUser = await this._userService.getUser(authToken, alias);
      if (toUser) {
        if (!displayedUser || !toUser.equals(displayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }
}
