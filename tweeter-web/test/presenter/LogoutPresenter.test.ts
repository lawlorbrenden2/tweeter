import { AuthToken } from "tweeter-shared";
import {
  LogoutPresenter,
  LogoutView,
} from "../../src/presenter/LogoutPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model.service/UserService";

describe("LogoutPresenter", () => {
  let mockLogoutPresenterView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockLogoutPresenterView = mock<LogoutView>();
    const mockLogoutPresenterViewInstance = instance(mockLogoutPresenterView);
    when(mockLogoutPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageID123");

    const logoutPresenterSpy = spy(
      new LogoutPresenter(mockLogoutPresenterViewInstance),
    );
    logoutPresenter = instance(logoutPresenterSpy);

    mockService = mock<UserService>();
    when(logoutPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(
      mockLogoutPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();
  });

  it("tells the view to clear the info message that was displayed previously, clears the user info, and navigate to the login page", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutPresenterView.deleteMessage("messageID123")).once();
    verify(mockLogoutPresenterView.clearUserInfo()).once();
    verify(mockLogoutPresenterView.navigate("/login")).once();
    verify(mockLogoutPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);

    await logoutPresenter.logOut(authToken);

    let [errorString] = capture(
      mockLogoutPresenterView.displayErrorMessage,
    ).last();
    verify(
      mockLogoutPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: An error occurred`,
      ),
    ).once();

    verify(mockLogoutPresenterView.deleteMessage(anything())).never();
    verify(mockLogoutPresenterView.clearUserInfo()).never();
    verify(mockLogoutPresenterView.navigate("/login")).never();
  });
});
