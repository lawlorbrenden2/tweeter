// AI-assisted: see AI-ATTRIBUTION.md
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { dynamoClient } from "./DynamoClient";

export class DynamoStatusDAO implements StatusDAO {
  private readonly storyTableName = "story";
  private readonly feedTableName = "feed";

  async putStory(status: StatusDto): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.storyTableName,
        Item: {
          sender_alias: status.user.alias,
          timestamp: status.timestamp,
          post: status.post,
          user: status.user,
        },
      }),
    );
  }

  async putFeed(followerAlias: string, status: StatusDto): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.feedTableName,
        Item: {
          receiver_alias: followerAlias,
          timestamp: status.timestamp,
          post: status.post,
          user: status.user,
        },
      }),
    );
  }

  async putFeedBatch(
    followerAliases: string[],
    status: StatusDto,
  ): Promise<void> {
    for (let offset = 0; offset < followerAliases.length; offset += 25) {
      let requestItems: BatchWriteCommandInput["RequestItems"] = {
        [this.feedTableName]: followerAliases
          .slice(offset, offset + 25)
          .map((followerAlias) => ({
            PutRequest: {
              Item: {
                receiver_alias: followerAlias,
                timestamp: status.timestamp,
                post: status.post,
                user: status.user,
              },
            },
          })),
      };

      for (let attempt = 0; ; attempt++) {
        const result: BatchWriteCommandOutput = await dynamoClient.send(
          new BatchWriteCommand({ RequestItems: requestItems }),
        );

        if (!result.UnprocessedItems?.[this.feedTableName]?.length) {
          break;
        }

        if (attempt >= 5) {
          throw new Error("Feed batch write has unprocessed items after 5 retries");
        }

        requestItems = result.UnprocessedItems;
        await new Promise<void>((resolve) =>
          setTimeout(resolve, 100 * 2 ** attempt),
        );
      }
    }
  }

  async getPageOfStory(
    userAlias: string,
    pageSize: number,
    lastItemTimestamp?: number,
  ): Promise<[StatusDto[], boolean]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.storyTableName,
        KeyConditionExpression: "sender_alias = :userAlias",
        ExpressionAttributeValues: { ":userAlias": userAlias },
        ScanIndexForward: false,
        Limit: pageSize,
        ExclusiveStartKey:
          lastItemTimestamp !== undefined
            ? {
                sender_alias: userAlias,
                timestamp: lastItemTimestamp,
              }
            : undefined,
      }),
    );

    const items: StatusDto[] = (result.Items ?? []).map((item) => ({
      post: item.post,
      user: item.user,
      timestamp: item.timestamp,
    }));
    return [items, Boolean(result.LastEvaluatedKey)];
  }

  async getPageOfFeed(
    userAlias: string,
    pageSize: number,
    lastItemTimestamp?: number,
  ): Promise<[StatusDto[], boolean]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.feedTableName,
        KeyConditionExpression: "receiver_alias = :userAlias",
        ExpressionAttributeValues: { ":userAlias": userAlias },
        ScanIndexForward: false,
        Limit: pageSize,
        ExclusiveStartKey:
          lastItemTimestamp !== undefined
            ? {
                receiver_alias: userAlias,
                timestamp: lastItemTimestamp,
              }
            : undefined,
      }),
    );

    const items: StatusDto[] = (result.Items ?? []).map((item) => ({
      post: item.post,
      user: item.user,
      timestamp: item.timestamp,
    }));
    return [items, Boolean(result.LastEvaluatedKey)];
  }
}