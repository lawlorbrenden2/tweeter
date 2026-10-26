import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUserInstance = new User("Test", "User", "@test", "url");
  const mockAuthTokenInstance = new AuthToken("token", Date.now());

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with the Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the Post Status and Clear buttons when the text field has text", async () => {
    const { postStatusButton, clearButton } =
      await renderPostStatusAndEnterText("a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the Post Status and Clear buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, textField, user } =
      await renderPostStatusAndEnterText("a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with the correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const postText = "testPost123";

    const { postStatusButton, user } = await renderPostStatusAndEnterText(
      postText,
      mockPresenterInstance,
    );

    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        mockAuthTokenInstance,
        postText,
        mockUserInstance,
      ),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("text");

  return { user, postStatusButton, clearButton, textField };
}

async function renderPostStatusAndEnterText(
  text: string,
  presenter?: PostStatusPresenter,
) {
  const elements = renderPostStatusAndGetElement(presenter);
  await elements.user.type(elements.textField, text);
  return elements;
}
