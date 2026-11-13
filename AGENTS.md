# AGENTS.md

## Project
Tweeter: A social media web application project for my Software Design class using React (frontend) and AWS Lambda + API Gateway (serverless backend). 
The repository is split into modules: `tweeter-shared` (common DTOs, requests, and responses), `tweeter-server` (AWS Lambda handlers and backend services), and the client module (React UI, Presenters, and network layer). Tests use Jest.

## Commands
- Build: npm run build
- Test: npm test
- Lint: npm run lint
- Type check: npx tsc --noEmit

## Conventions
- **AWS Lambdas:** Every Lambda handler MUST return the CORS header `"Access-Control-Allow-Origin": "*"` in its response. 
- **Data Flow:** The client must NEVER import or call `FakeData` directly. The client calls `ServerFacade`, which uses `ClientCommunicator` (fetch) to hit API Gateway endpoints.
- **Shared Types:** Rely on the request/response classes in `tweeter-shared` (like `TweeterRequest`, `TweeterResponse`, or generic `PagedResponse<T>`).
- Use named exports, not default exports.
- Do not use the `any` type
- Return errors in the existing { "error": "..." } JSON format

## Off-limits
- Do not edit files in src/generated/ (the build produces them)
- Do not add npm dependencies without asking

## AI attribution
After each task that changes files, append an entry to
AI-ATTRIBUTION.md in the repository root, creating the file if it does
not exist. Use this format, with today's date:

    ## YYYY-MM-DD: <each file changed, with (new file) after new ones>
    - Tool: <tool name>
    - Task: <the task I gave you, in one or two sentences>
    - Review: TODO

Leave the Review line as TODO. I fill it in after I review the change.
List every file you changed or created, including tests, and do not
list anything you did not change.
If a TypeScript file you created or changed does not already start
with this line, add it as the first line:

    // AI-assisted: see AI-ATTRIBUTION.md