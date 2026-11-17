// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";

describe("ServerFacade integration", () => {
  const serverFacade = new ServerFacade();
  const token = "integration-test-token";
  const userAlias = "@allen";

  it("register returns Allen Anderson and an auth token", async () => {
    const [user, authToken] = await serverFacade.register({
      firstName: "Allen",
      lastName: "Anderson",
      alias: userAlias,
      password: "integration-test-password",
      userImageBytes: "aW1hZ2U=",
      imageFileExtension: "png",
    });

    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(typeof authToken.token).toBe("string");
    expect(authToken.token.length).toBeGreaterThan(0);
    expect(authToken.timestamp).toBeGreaterThan(0);
  }, 30000);

  it("getMoreFollowers returns users and a hasMore boolean", async () => {
    const [users, hasMore] = await serverFacade.getMoreFollowers({
      token,
      userAlias,
      pageSize: 10,
      lastItem: null,
    });

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    for (const user of users) {
      expect(user).toBeInstanceOf(User);
    }
    expect(typeof hasMore).toBe("boolean");
  }, 30000);

  it("getFollowerCount returns a positive number", async () => {
    const count = await serverFacade.getFollowerCount({ token, userAlias });

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  }, 30000);
});