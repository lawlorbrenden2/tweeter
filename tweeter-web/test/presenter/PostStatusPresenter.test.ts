import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("postStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;
  const mockUser = mock<User>();
  const currentUser = instance(mockUser);
  const mockStatus = mock<Status>();
  const currentStatus = instance(mockStatus);

  const authToken = new AuthToken("abc123", Date.now());
  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView,
    );
    when(
      mockPostStatusPresenterView.displayInfoMessage(anything(), 0),
    ).thenReturn("messageID123");

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(
      authToken,
      "messageID123",
      currentUser,
    );
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(
      authToken,
      "messageID123",
      currentUser,
    );
    verify(mockService.postStatus(authToken, anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedStatus.post).toEqual("messageID123");
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(
      authToken,
      "messageID123",
      currentUser,
    );
    verify(mockPostStatusPresenterView.deleteMessage("messageID123")).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(
      authToken,
      "messageID123",
      currentUser,
    );

    let [errorString] = capture(
      mockPostStatusPresenterView.displayErrorMessage,
    ).last();

    verify(mockPostStatusPresenterView.deleteMessage("messageID123")).once();
    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        `Failed to post the status because of exception: An error occurred`,
      ),
    ).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
