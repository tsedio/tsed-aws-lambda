import { JwtService } from "@project/infra/auth/services/JwtService.js"
import { AwsPolicyService } from "@project/infra/aws/auth/AwsPolicyService.js"
import { Controller, Inject } from "@tsed/di"
import { Context } from "@tsed/platform-params"
import { ServerlessContext } from "@tsed/platform-serverless"
import { Description, Get } from "@tsed/schema"
import type { APIGatewayTokenAuthorizerEvent } from "aws-lambda"

export type AuthorizeServerlessContext = ServerlessContext<APIGatewayTokenAuthorizerEvent>

@Controller("/")
export class LambdaAuthorizerController {
  @Inject()
  protected awsPolicyService: AwsPolicyService

  @Inject()
  protected jwtService: JwtService

  @Get("/authorizer")
  @Description("this endpoint is used to authorize the request using Lambda aws")
  async authorizer(@Context() $ctx: AuthorizeServerlessContext) {
    const decodedToken = await this.jwtService.decode($ctx.event.authorizationToken.replace("Bearer ", ""))
    const { user } = decodedToken.payload

    // example on how to manage auth and format the response depending on the user scope
    if (!user.scopes.includes("api")) {
      // not allowed to consume API
      return $ctx.response.status(401).body(this.awsPolicyService.generateDeny("me", $ctx.event.methodArn))
    }

    if (user.scopes.includes("timeslots")) {
      // allowed to consume timeslots
      return this.awsPolicyService.generateAllow("me", $ctx.event.methodArn, {
        user
      })
    }

    // no API resource allowed
    return this.awsPolicyService.generateDeny("me", $ctx.event.methodArn)
  }
}
