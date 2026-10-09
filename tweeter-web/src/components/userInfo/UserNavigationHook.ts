import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

export const useUserNavigation = () => {
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };
  const presenter = new UserNavigationPresenter(listener);

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string,
  ): Promise<void> => {
    event.preventDefault();
    const alias = extractAlias(event.target.toString());
    presenter.navigateToUser(authToken!, alias, featurePath, displayedUser);
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  return { navigateToUser };
};
