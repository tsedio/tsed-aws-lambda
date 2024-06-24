import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { Configuration, registerProvider } from "@tsed/di"
console.log(DynamoDB)
registerProvider({
  provide: DynamoDB,
  deps: [Configuration],
  useFactory: (configuration: Configuration) => {
    return new DynamoDB({ region: configuration.get("envs.AWS_REGION") })
  }
})
