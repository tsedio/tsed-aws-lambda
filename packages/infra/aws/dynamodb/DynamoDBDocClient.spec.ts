import "./DynamoDBDocClient.js"

import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { DITest } from "@tsed/di"

vi.mock("@aws-sdk/client-dynamodb", () => {
  return {
    DynamoDB: class {
      constructor(public opts: never) {}
    }
  }
})

vi.mock("@aws-sdk/lib-dynamodb", () => {
  return {
    DynamoDBDocumentClient: class {
      static from = vi.fn().mockReturnValue({})
    }
  }
})

describe("DynamoDBClient", () => {
  beforeEach(() =>
    DITest.create({
      envs: {
        AWS_REGION: "us-east-1"
      }
    })
  )
  afterEach(() => DITest.reset())
  it("should create a new instance", () => {
    const dynamoDocDB = DITest.get<DynamoDBDocumentClient>(DynamoDBDocumentClient)
    const client = DITest.get<DynamoDB>(DynamoDB)

    expect(dynamoDocDB).toEqual({})
    expect(DynamoDBDocumentClient.from).toHaveBeenCalledWith(client)
  })
})
