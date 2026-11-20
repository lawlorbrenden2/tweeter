import { AuthDAO } from "./AuthDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  getUserDAO(): UserDAO;
  getAuthDAO(): AuthDAO;
  getFollowDAO(): FollowDAO;
  getStatusDAO(): StatusDAO;
  getImageDAO(): ImageDAO;
}