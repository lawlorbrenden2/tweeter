export interface FollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getFollow(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string,
  ): Promise<[string[], boolean]>;
  getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string,
  ): Promise<[string[], boolean]>;
}
