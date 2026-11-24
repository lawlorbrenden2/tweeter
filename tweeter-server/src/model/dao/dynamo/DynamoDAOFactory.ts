// AI-assisted: see AI-ATTRIBUTION.md
import { AuthDAO } from "../AuthDAO";
import { DAOFactory } from "../DAOFactory";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StatusDAO } from "../StatusDAO";
import { UserDAO } from "../UserDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";
import { DynamoAuthDAO } from "./DynamoAuthDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoDAOFactory implements DAOFactory {
  getUserDAO(): UserDAO {
    return new DynamoUserDAO();
  }

  getAuthDAO(): AuthDAO {
    return new DynamoAuthDAO();
  }

  getFollowDAO(): FollowDAO {
    return new DynamoFollowDAO();
  }

  getStatusDAO(): StatusDAO {
    return new DynamoStatusDAO();
  }

  getImageDAO(): ImageDAO {
    return new S3ImageDAO();
  }
}