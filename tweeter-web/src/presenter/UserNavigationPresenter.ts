import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (displayedUser: User) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  _view: UserNavigationView;
  _userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this._userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken,
    alias: string,
    featurePath: string,
    displayedUser: User | null,
  ): Promise<void> {
    try {
      const toUser = await this._userService.getUser(authToken, alias);
      if (toUser) {
        if (!displayedUser || !toUser.equals(displayedUser)) {
          this._view.setDisplayedUser(toUser);
          this._view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}
