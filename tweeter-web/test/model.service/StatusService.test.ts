// AI-assisted: see AI-ATTRIBUTION.md
import "isomorphic-fetch";
import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("StatusService integration", () => {
  it("getStoryItems returns statuses and a hasMore boolean", async () => {
    const statusService = new StatusService();
    const authToken = new AuthToken("integration-test-token", Date.now());

    const [statuses, hasMore] = await statusService.getStoryItems(
      authToken,
      "@allen",
      10,
      null,
    );

    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    for (const status of statuses) {
      expect(status).toBeInstanceOf(Status);
    }
    expect(typeof hasMore).toBe("boolean");
  }, 30000);
});