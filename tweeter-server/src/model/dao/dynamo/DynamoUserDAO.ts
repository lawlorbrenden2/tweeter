// AI-assisted: see AI-ATTRIBUTION.md
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { dynamoClient } from "./DynamoClient";

export class DynamoUserDAO implements UserDAO {
  private readonly tableName = "users";

  async putUser(user: UserDto, passwordHash: string): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          alias: user.alias,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          passwordHash,
          followerCount: 0,
          followeeCount: 0,
        },
      }),
    );
  }

  async getUser(
    alias: string,
  ): Promise<{ user: UserDto; passwordHash: string } | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      }),
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item;
    return {
      user: {
        firstName: item.firstName,
        lastName: item.lastName,
        alias: item.alias,
        imageUrl: item.imageUrl,
      },
      passwordHash: item.passwordHash,
    };
  }

  async updateFollowerCount(alias: string, delta: number): Promise<void> {
    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { alias },
        UpdateExpression:
          "SET followerCount = if_not_exists(followerCount, :zero) + :delta",
        ExpressionAttributeValues: { ":zero": 0, ":delta": delta },
      }),
    );
  }

  async updateFolloweeCount(alias: string, delta: number): Promise<void> {
    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { alias },
        UpdateExpression:
          "SET followeeCount = if_not_exists(followeeCount, :zero) + :delta",
        ExpressionAttributeValues: { ":zero": 0, ":delta": delta },
      }),
    );
  }

  async getFollowerCount(alias: string): Promise<number> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      }),
    );

    return result.Item?.followerCount ?? 0;
  }

  async getFolloweeCount(alias: string): Promise<number> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      }),
    );

    return result.Item?.followeeCount ?? 0;
  }
}