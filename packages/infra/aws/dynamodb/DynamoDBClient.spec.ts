import "./DynamoDBClient.js"

import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DITest } from "@tsed/di"

vi.mock("@aws-sdk/client-dynamodb", () => {
  return {
    DynamoDB: class {
      constructor(public opts: never) {}
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
    const dynamoDB = DITest.get<DynamoDB & { opts: never }>(DynamoDB)

    expect(dynamoDB.opts).toEqual({ region: "us-east-1" })
  })
})
