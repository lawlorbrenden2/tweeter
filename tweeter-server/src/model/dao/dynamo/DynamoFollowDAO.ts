// AI-assisted: see AI-ATTRIBUTION.md
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDAO } from "../FollowDAO";
import { dynamoClient } from "./DynamoClient";

export class DynamoFollowDAO implements FollowDAO {
  private readonly tableName = "follows";
  private readonly indexName = "follows_index";

  async putFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      }),
    );
  }

  async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      }),
    );
  }

  async getFollow(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      }),
    );

    return Boolean(result.Item);
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias?: string,
  ): Promise<[string[], boolean]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: "followee_handle = :followeeAlias",
        ExpressionAttributeValues: { ":followeeAlias": followeeAlias },
        Limit: pageSize,
        ExclusiveStartKey:
          lastFollowerAlias !== undefined
            ? {
                follower_handle: lastFollowerAlias,
                followee_handle: followeeAlias,
              }
            : undefined,
      }),
    );

    const items: string[] = (result.Items ?? []).map(
      (item) => item.follower_handle,
    );
    return [items, Boolean(result.LastEvaluatedKey)];
  }

  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias?: string,
  ): Promise<[string[], boolean]> {
    const result = await dynamoClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "follower_handle = :followerAlias",
        ExpressionAttributeValues: { ":followerAlias": followerAlias },
        Limit: pageSize,
        ExclusiveStartKey:
          lastFolloweeAlias !== undefined
            ? {
                follower_handle: followerAlias,
                followee_handle: lastFolloweeAlias,
              }
            : undefined,
      }),
    );

    const items: string[] = (result.Items ?? []).map(
      (item) => item.followee_handle,
    );
    return [items, Boolean(result.LastEvaluatedKey)];
  }
}