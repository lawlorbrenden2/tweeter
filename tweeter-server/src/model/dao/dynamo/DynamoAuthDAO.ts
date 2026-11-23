// AI-assisted: see AI-ATTRIBUTION.md
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthTokenDto } from "tweeter-shared";
import { AuthDAO } from "../AuthDAO";
import { dynamoClient } from "./DynamoClient";

export class DynamoAuthDAO implements AuthDAO {
  private readonly tableName = "authtokens";

  async putAuthToken(token: AuthTokenDto, alias: string): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: { token: token.token, timestamp: token.timestamp, alias },
      }),
    );
  }

  async getAuthToken(
    token: string,
  ): Promise<{ authToken: AuthTokenDto; alias: string } | null> {
    const result = await dynamoClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token },
      }),
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item;
    return {
      authToken: { token: item.token, timestamp: item.timestamp },
      alias: item.alias,
    };
  }

  async updateAuthToken(token: string, newTimestamp: number): Promise<void> {
    await dynamoClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { token },
        UpdateExpression: "SET #ts = :timestamp",
        ExpressionAttributeNames: { "#ts": "timestamp" },
        ExpressionAttributeValues: { ":timestamp": newTimestamp },
      }),
    );
  }

  async deleteAuthToken(token: string): Promise<void> {
    await dynamoClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { token },
      }),
    );
  }
}