import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { Configuration, registerProvider } from "@tsed/di"

registerProvider({
  provide: DynamoDB,
  deps: [Configuration],
  useFactory: (configuration: Configuration) => {
    return new DynamoDB({ region: configuration.get("envs.AWS_REGION") })
  }
})
