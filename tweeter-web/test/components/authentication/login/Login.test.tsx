import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and password fields have text", async () => {
    const { signInButton } = await renderLoginAndEnterCredentials(
      "/",
      "a",
      "b",
    );

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either the alias or the password is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      await renderLoginAndEnterCredentials("/", "a", "b");

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with the correct parameters when the sign in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "password123";
    const rememberMe = false;

    const { signInButton, user } = await renderLoginAndEnterCredentials(
      originalUrl,
      alias,
      password,
      mockPresenterInstance,
    );

    await user.click(signInButton);

    verify(
      mockPresenter.login(alias, password, rememberMe, originalUrl),
    ).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}

async function renderLoginAndEnterCredentials(
  originalUrl: string,
  alias: string,
  password: string,
  presenter?: LoginPresenter,
) {
  const elements = renderLoginAndGetElement(originalUrl, presenter);

  await elements.user.type(elements.aliasField, alias);
  await elements.user.type(elements.passwordField, password);

  return elements;
}
