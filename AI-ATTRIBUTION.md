## 2026-11-16: tweeter-server/src/lambda/follow/GetFollowersLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, , AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getFollowers end-to-end using the shared paged-user DTOs, backend FollowService, and frontend facade. Add regression tests for serialization, deserialization, pagination, and error handling.
- Review: I inspected GetFollowersLambda.ts to ensure it contained no cross-project imports from tweeter-web, verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-16: tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/index.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Add and export shared IsFollowerRequest and IsFollowerResponse interfaces for getIsFollowerStatus, following existing shared interface conventions without adding tests.
- Review: I inspected IsFollowerRequest.ts, IsFollowerResponse.ts, index.ts to make sure all of the files were properly generated according to the established conventions.

## 2026-11-16: tweeter-server/src/lambda/follow/GetIsFollowerStatusLambda.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getIsFollowerStatus end-to-end using the existing exported shared interfaces, backend FollowService, and frontend facade. Follow existing Lambda validation and error handling conventions without adding tests.
- Review: I inspected GetIsFollowerStatusLambda.ts to ensure it contained no cross-project imports from tweeter-web, verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-16: tweeter-shared/src/model/net/request/FollowCountRequest.ts (new file), tweeter-shared/src/model/net/response/FollowCountResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/follow/GetFolloweeCountLambda.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getFolloweeCount end-to-end with shared count interfaces, a backend Lambda and API mapping, and frontend facade/service integration. Follow existing validation and error handling conventions without adding tests.
- Review: I inspected GetFolloweeCountLambda.ts to ensure it contained no cross-project imports from tweeter-web, verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-16: tweeter-server/src/lambda/follow/GetFollowerCountLambda.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getFollowerCount end-to-end using the shared follow-count request/response types, existing Lambda validation and error handling, and frontend facade/service integration. Build all three modules without adding tests or dependencies.
- Review: I inspected GetFollowerCountLambda.ts to ensure it contained no cross-project imports from tweeter-web, verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-16: tweeter-shared/src/model/net/request/FollowRequest.ts (new file), tweeter-shared/src/model/net/response/FollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/follow/FollowLambda.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /follow end-to-end with shared interfaces, a backend Lambda and API mapping, and frontend facade/service integration while preserving frontend count updates and the return statement. Build all three modules without adding tests or dependencies.
- Review: I inspected FollowLambda.ts to ensure it contained no cross-project imports from tweeter-web, FollowRequest.ts and FollowResponse.ts to make sure they were implemented correctly, and both FollowServices (in web and server) to make sure no core business logic was changed in either one, outside of the updates to call the ServerFacade. I verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-16: tweeter-shared/src/model/net/request/UnfollowRequest.ts (new file), tweeter-shared/src/model/net/response/UnfollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/lambda/follow/UnfollowLambda.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /unfollow end-to-end with shared interfaces, a backend Lambda and API mapping, and frontend facade/service integration while preserving frontend count updates and the return statement. Build all three modules without adding tests or dependencies.
- Review: I did the exact same thing as I did for the follow feature, except for unfollow instead.

## 2026-11-17: tweeter-shared/src/model/dto/StatusDto.ts (new file), tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-shared/src/model/domain/Status.ts, tweeter-server/src/model/service/StatusService.ts (new file), tweeter-server/src/lambda/status/GetFeedItemsLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getFeedItems end-to-end with shared status DTOs and pagination interfaces, backend FakeData service and Lambda, API configuration, and frontend facade/service wiring. Add status DTO conversion and build all three modules without adding tests or dependencies.
- Review: I reviewed GetFeedItemsLambda.ts, the Status service in the server directory, PagedStatusItemRequest and Response, and the Server Facade to ensure all of the code followed the existing conventions and didn't import web files where it shouldn't. I also reviewed the Status domain object changes to make sure they were needed for program flow.

## 2026-11-17: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/GetStoryItemsLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getStoryItems end-to-end using backend FakeData pagination, the existing feed Lambda validation and error handling pattern, SAM API configuration, and frontend facade/service wiring with Status DTO conversion. Build the server and web modules without adding tests or dependencies.
- Review: I inspected GetStoryItemsLambda.ts to ensure it contained no cross-project imports from tweeter-web, verified the handler path and API path in template.yaml were correct, and ran npm run build locally to confirm both the server and web modules compiled without errors.

## 2026-11-17: tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/model/net/response/PostStatusResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /postStatus end-to-end with shared request/response interfaces, a simulated successful backend service and Lambda, SAM API configuration, and frontend facade/service wiring using newStatus.dto. Build all three modules without adding tests or dependencies.
- Review: I inspected PostStatusLambda.ts to ensure it contained no cross-project imports, and verified the handler and API paths in template.yaml. I checked the backend StatusService to confirm it correctly simulates a successful write operation by returning void. I also verified the frontend StatusService properly converts the Status domain object into newStatus.dto before sending it to the ServerFacade. Finally, I rebuilt the Lambda layer (npm run build:layer) and confirmed all three modules compiled without errors.

## 2026-11-17: tweeter-shared/src/model/net/request/GetUserRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts (new file), tweeter-server/src/lambda/user/GetUserLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /getUser end-to-end with shared request/response interfaces, a backend FakeData service and Lambda using existing validation and error handling, SAM API configuration, and frontend facade/service wiring with User DTO conversion. Build all three modules without adding tests or dependencies.
- Review: I inspected GetUserLambda.ts to ensure it contained no cross-project imports and verified the paths in template.yaml. I checked the frontend ServerFacade to confirm it correctly mapped the UserDto back to a User domain object using User.fromDto(). Finally, I rebuilt the Lambda layer and confirmed all three modules compiled without errors.

## 2026-11-17: tweeter-shared/src/model/dto/AuthTokenDto.ts (new file), tweeter-shared/src/model/domain/AuthToken.ts, tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/model/net/response/LoginResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/LoginLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ClientCommunicator.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /login end-to-end with shared authentication DTOs and interfaces, backend FakeData service and Lambda following GetUserLambda validation/error handling, SAM API configuration, and frontend facade/service wiring. Build all three modules without adding tests or dependencies.
- Review: I inspected LoginLambda.ts to ensure it contained no cross-project imports and verified the paths in template.yaml. I checked the frontend ServerFacade to confirm it correctly mapped both UserDto and AuthTokenDto back to their domain objects using their respective fromDto() methods. I also noticed and approved the agent's update to ClientCommunicator.ts to allow requests without auth tokens. Finally, I rebuilt the Lambda layer and confirmed all modules compiled successfully.

## 2026-11-17: tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/response/RegisterResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/RegisterLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /register end-to-end with shared request/response interfaces, a backend FakeData service and Lambda matching login validation/error handling, SAM API configuration, and frontend facade/service wiring with base64 image encoding and domain-object conversion. Build all three modules without adding tests or dependencies.
- Review: I inspected RegisterLambda.ts to ensure it contained no cross-project imports and properly validated all six incoming request fields. I verified the frontend UserService correctly converts the raw Uint8Array image bytes into a Base64 string before attaching it to the RegisterRequest. I did change RegisterRequest.ts to not extend TweeterRequest.ts to match the login functionality (login and register requests don't have the required authtoken yet) and updated the client communicator to reflect this change. I also had to make a quick change to my Register component to wrap inside of a use effect hook so that the image bytes would persist. Finally, I rebuilt the Lambda layer and confirmed all modules compiled successfully.

## 2026-11-17: tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/model/net/response/LogoutResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/LogoutLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement POST /logout end-to-end with shared interfaces, a simulated backend service, a Lambda matching PostStatusLambda validation/error handling, SAM configuration, and frontend wiring. Build all three modules without adding tests or dependencies, removing the stale registration token field that blocked the web build.
- Review: I inspected LogoutLambda.ts to ensure it contained no cross-project imports and validated the token. I verified the backend UserService simulates a successful logout by returning void, and checked that the frontend ServerFacade properly sends the token. I also reviewed and approved the agent's fix in the frontend UserService to remove the stale token field from the register payload. Finally, I rebuilt the Lambda layer and confirmed all modules compiled successfully.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts (new file), tweeter-web/test/model.service/StatusService.test.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Add four success-path Jest integration tests calling ServerFacade and StatusService directly against the deployed API, checking registration values, follower results and counts, and story statuses.
- Review: I inspected both test files to ensure they were testing for actual data validation rather than just checking if a generic object was returned. I also confirmed no failure case tests were written as per the constraints, and ran npm test to ensure all tests passed successfully.

## 2026-11-17: tweeter-web/src/net/ServerFacade.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Refactor all 14 ServerFacade endpoint methods to share a private checkResponseForErrors helper without changing network calls, generic types, or DTO conversions. Run the tweeter-web build to verify compilation.
- Review: I checked ServerFacade.ts to make sure duplicated logic was properly filtered out to the helper method, then ensured the tests still passed and that the app functioned properly.


## 2026-11-17: tweeter-server/src/lambda/follow/FollowLambda.ts, tweeter-server/src/lambda/follow/GetFolloweeCountLambda.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowerCountLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/follow/GetIsFollowerStatusLambda.ts, tweeter-server/src/lambda/follow/UnfollowLambda.ts, tweeter-server/src/lambda/status/GetFeedItemsLambda.ts, tweeter-server/src/lambda/status/GetStoryItemsLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/src/lambda/user/RegisterLambda.ts, tweeter-server/src/util/ServerUtil.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Extract shared CORS headers and the exact existing error-handling logic into ServerUtil.ts and update all 14 Lambda handlers without changing validation, service calls, or success payloads. Run the tweeter-server build to verify compilation.
- Review: I verified all of the lambda files called ServerUtils.ts and preserved there already existing business logic. Then I recompiled and redployed my server and then checked that the tests and the application still passed / worked.

## 2026-11-22: tweeter-server/template.yaml, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Define five on-demand DynamoDB tables and a generated-name S3 profile-image bucket with public object reads. Scope the shared Lambda IAM permissions to the five tables, follows_index, and bucket object reads/writes without changing API or Lambda settings.
- Review: I verified the results of sam validate and looked over the schema in template.json to make sure that the schema definition followed my definitions.

## 2026-11-22: tweeter-server/src/model/dao/s3/S3ImageDAO.ts (new file), tweeter-server/template.yaml, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement S3ImageDAO with environment-based bucket and region configuration, base64 image decoding, extension-based content types, and public object URLs without object ACLs. Expose the generated profile-image bucket name to all Lambda functions and validate without adding unit test files.
- Review: I inspected S3ImageDAO.ts and FollowService.ts to make sure Cline followed all of the conventions and implemented the files correctly. I noticed one minor error in the FollowService constructor which I fixed myself.

## 2026-11-22: tweeter-server/src/model/dao/dynamo/DynamoClient.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoAuthDAO.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Add a shared region-configured DynamoDB document client and implement AuthDAO token put, get, update, and delete operations against authtokens, escaping the timestamp attribute for updates. Validate TypeScript compilation without changing tests, services, handlers, or shared/client modules.
- Review: I checked both DynamoClient.ts and DynamoAuthDAO.ts to ensure the table name (authtokens), key (token), and null handling were all implemented correctly.

## 2026-11-22: tweeter-server/src/model/dao/dynamo/DynamoUserDAO.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement DynamoUserDAO against the users table using the shared DynamoDB document client, including user storage and retrieval, atomic follower/followee count updates, and count reads with zero defaults. Validate targeted TypeScript compilation without changing tests, services, handlers, or shared/client modules.
- Review: Verified DynamoUserDAO.ts properly implemented UserDAO.ts.

## 2026-11-22: tweeter-server/src/model/service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Replace UserService FakeData usage with injected user, auth, and image DAOs and bcryptjs password hashing. Preserve aliases and unauthorized login errors, and enforce a refreshed 30-minute inactivity timeout without adding test files or dependencies.
- Review: Reviewed UserService.ts to make sure FakeData was gone, database operations were implemented properly, and bcryptjs was hashed properly.

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoFollowDAO.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement DynamoFollowDAO using the shared DynamoDB client with composite-key follow operations and paginated followee/follower queries against follows and follows_index. Store only unchanged handles and validate targeted TypeScript compilation without modifying tests or protected files.
- Review: Verified that getPageOfFollowers queries the follows_index GSI while getPageOfFollowees queries the base follows table, and that both build ExclusiveStartKey with both follower_handle and followee_handle. Confirmed aliases are stored unchanged and targeted TypeScript compilation passed.

## 2026-11-23: tweeter-server/src/model/service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Replace FollowService FakeData usage with injected follow, user, and auth DAOs, including refreshed 30-minute token validation, alias-preserving pagination, and idempotent follow/unfollow count updates. Preserve public signatures and validate targeted TypeScript compilation without changing test files or adding dependencies.
- Review: Reviewed FollowService.ts to make sure FakeData was gone, database operations were implemented properly.

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoStatusDAO.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement DynamoStatusDAO with alias-preserving story/feed writes, newest-first timestamp pagination, and 25-item feed batches using native user maps and at most five exponential-backoff retries for unprocessed items. Validate targeted TypeScript compilation without modifying interfaces, services, handlers, shared/client modules, or tests.
- Review: Checked that all of the methods in DynamoStatusDAO were implemented properly. I noticed that a putFeedBatch method was added to DynamoStatusDAO and needs to be added to the StatusDAO interface. I'll fix that with the next commit / prompt, which be to refactor the StatusDAO interface.

## 2026-11-23: tweeter-server/src/model/dao/StatusDAO.ts, tweeter-server/src/model/service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Add putFeedBatch to StatusDAO and replace StatusService FakeData usage with injected status, follow, and auth DAOs, refreshed 30-minute token validation, and paginated follower feed writes. Reject author aliases that do not exactly match the authenticated alias, as confirmed by the user, while preserving public signatures and aliases.
- Review: Verified putFeedBatch method was properly defined in the StatusDAO, FakeData was completely gone from StatusService, and that database operations were implemented properly.

## 2026-11-23: tweeter-server/src/model/dao/dynamo/DynamoDAOFactory.ts (new file), AI-ATTRIBUTION.md
- Tool: Cline
- Task: Implement the named-export DynamoDAOFactory adhering to DAOFactory, returning new concrete DynamoDB and S3 DAO instances on each call. Validate targeted TypeScript compilation without modifying DAO interfaces, implementations, services, handlers, templates, shared/client modules, or tests.
- Review: Verified the DynamoDAOFactory properly implements the DAOFactory and returns all the DAOs.

## 2026-11-23: tweeter-server/src/model/service/AuthService.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Extract shared auth-token validation into AuthService and delegate validation from UserService, FollowService, and StatusService while preserving public signatures, errors, and inactivity-timeout behavior. Confirm the existing DynamoDAOFactory and validate targeted TypeScript compilation without modifying DAOs, handlers, templates, shared/client modules, or tests.
- Review: Verified all three service classes (and the new one) that the duplicated logic had been taken out.

## 2026-11-23: tweeter-server/src/lambda/user/RegisterLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Wire DynamoDAOFactory into RegisterLambda and LoginLambda by injecting it into UserService, preserving request validation, ServerUtil CORS/error handling, and response structures. Validate targeted TypeScript compilation without changing other handlers, services, DAOs, templates, client/shared modules, or tests.
- Review: Reviewed RegisterLambda and LoginLambda to ensure they properly instatiated DynamoDAOFactory.

## 2026-11-24: tweeter-server/src/model/dao/dynamo/DynamoStatusDAO.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Extract shared DynamoStatusDAO story/feed pagination into a private getPageOfStatuses helper while preserving public signatures and DynamoDB query behavior. Validate with the tweeter-server build without adding tests.
- Review: Verified the newly created helper function preserved the original logic and that it is called properly by the two other functions.

## 2026-11-24: tweeter-server/src/model/service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Cline
- Task: Extract duplicated alias-to-UserDto resolution in FollowService into a private resolveUsers helper using Promise.all and flatMap, preserving public signatures and behavior. Validate with the tweeter-server build without adding tests.
- Review: Verified the newly created helper function preserved the original logic and that it is called properly by the two other functions.