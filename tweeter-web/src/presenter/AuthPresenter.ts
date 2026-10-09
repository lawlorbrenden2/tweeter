import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthView {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class AuthPresenter {
  private _view: AuthView;
  private _userService: UserService;

  protected constructor(view: AuthView) {
    this._view = view;
    this._userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  protected get userService() {
    return this._userService;
  }
}
