import { UserInfo } from "@project/domain/users/UserInfo.js"
import { Injectable } from "@tsed/di"
import { serialize } from "@tsed/json-mapper"

export interface AwsAuthResponse {
  principalId: string
  policyDocument?: {
    Version: string
    Statement: {
      Action: string
      Effect: string
      Resource: string
    }[]
  }
  context: {
    user?: UserInfo
  }
}

@Injectable()
export class AwsPolicyService {
  // Help function to generate an IAM policy
  generatePolicy(principalId: string, effect: string, resource: string, context: AwsAuthResponse["context"]): AwsAuthResponse {
    // Required output:
    const authResponse: AwsAuthResponse = {
      principalId,
      // Optional output with custom properties of the String, Number or Boolean type.
      context: {
        ...context,
        user: serialize(context.user)
      }
    }

    if (effect && resource) {
      authResponse.policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
          }
        ]
      }
    }

    return authResponse
  }

  generateAllow(principalId: string, resource: string, context: AwsAuthResponse["context"]) {
    return this.generatePolicy(principalId, "Allow", resource, context)
  }

  generateDeny(principalId: string, resource: string, context: AwsAuthResponse["context"] = {}) {
    return this.generatePolicy(principalId, "Deny", resource, context)
  }
}
