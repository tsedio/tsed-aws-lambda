import "./DynamoDBClient.js"

import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { registerProvider } from "@tsed/di"

registerProvider({
  provide: DynamoDBDocumentClient,
  deps: [DynamoDB],
  useFactory: (client: DynamoDB) => {
    return DynamoDBDocumentClient.from(client)
  }
})
