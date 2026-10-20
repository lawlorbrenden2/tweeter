import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  public constructor(view: AuthView) {
    super(view);
  }

  public async login(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doAuthenticationOperation(
      () => this.userService.login(alias, password),
      "log user in",
      rememberMe,
      originalUrl,
    );
  }
}
