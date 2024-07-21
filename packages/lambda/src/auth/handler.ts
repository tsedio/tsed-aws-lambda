import "@tsed/ajv" // enable validation
import "@project/infra/aws/log-request/ServerlessLogRequest.js"

import { LambdaAuthorizerController } from "@project/controllers/auth/LambdaAuthorizerController.js"
import { PlatformServerless } from "@tsed/platform-serverless"

// shared configuration
const config = {
  envs: process.env,
  auth: {
    // Not applicable here because lambda are packaged and deployed on AWS.
    // For this reason, we can't use the file system to store data (prefer S3, DynamoDB, etc.)
    // dbFilePath: join(import.meta.dirname, "../../../../.tmp/timeslots.json")
  }
}

const handler = PlatformServerless.callback(LambdaAuthorizerController, "authorizer", config)

export const authorizer = async (event: never, context: never, callback: never) => {
  console.log("=>event", event)
  console.log("=>context", context)

  try {
    const response = await handler(event, context, callback)

    console.log("response", response)

    return response
  } catch (er) {
    console.error(er)
    throw er
  }
}
