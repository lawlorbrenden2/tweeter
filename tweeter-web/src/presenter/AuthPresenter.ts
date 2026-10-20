import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    rememberMe: boolean,
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthPresenter extends Presenter<AuthView> {
  private _userService: UserService;

  protected constructor(view: AuthView) {
    super(view);
    this._userService = new UserService();
  }

  protected get userService() {
    return this._userService;
  }

  protected async doAuthenticationOperation(
    operation: () => Promise<[User, AuthToken]>,
    operationDescription: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    this.view.setIsLoading(true);

    await this.doFailureReportingOperation(async () => {
      const [user, authToken] = await operation();
      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    }, operationDescription);

    this.view.setIsLoading(false);
  }
}
