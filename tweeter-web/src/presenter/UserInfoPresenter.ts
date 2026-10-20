import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private _followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this._followService = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this._followService.getIsFollowerStatus(
            authToken,
            currentUser,
            displayedUser,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this._followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this._followService.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  private async doFollowUnfollowOperation(
    operation: () => Promise<[number, number]>,
    actionWord: string,
    actionDescription: string,
    displayedUser: User,
    isFollower: boolean,
  ) {
    this.view.setIsLoading(true);
    const toastId = this.view.displayInfoMessage(
      `${actionWord} ${displayedUser.name}...`,
      0,
    );

    await this.doFailureReportingOperation(async () => {
      const [followerCount, followeeCount] = await operation();

      this.view.setIsFollower(isFollower);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, actionDescription);

    this.view.deleteMessage(toastId);
    this.view.setIsLoading(false);
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.doFollowUnfollowOperation(
      () => this._followService.follow(authToken, displayedUser),
      "Following",
      "follow user",
      displayedUser,
      true,
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.doFollowUnfollowOperation(
      () => this._followService.unfollow(authToken, displayedUser),
      "Unfollowing",
      "unfollow user",
      displayedUser,
      false,
    );
  }
}
