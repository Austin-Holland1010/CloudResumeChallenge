import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "CloudResumeChallenge";


let body;
let statusCode = 200;

export const handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "GET /items":
        //Read fron the database the current ViewCount
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        
        //Increment the ViewCount by 1
        body[0].ViewCount = body[0].ViewCount + 1;
        
        //Update the Database with the new ViewCount.
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              pk: "id",
              ViewCount: body[0].ViewCount
            },
          })
          );
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }
  
  return {
    statusCode,
    body,
    headers,
  };
};