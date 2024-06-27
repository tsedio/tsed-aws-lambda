import { UserInfo } from "@project/domain/users/UserInfo.js"
import { JwtService } from "@project/infra/auth/services/JwtService.js"
import { Command, Inject, Logger } from "@tsed/cli-core"

@Command({
  name: "generate-token",
  description: "Generate a new token for the user",
  args: {
    email: {
      description: "User email",
      type: String,
      required: true
    }
  },
  options: {
    "-s, --scope <scope>": {
      type: String,
      description: "Scopes to add to the token"
    }
  }
})
export class GenerateTokenCmd {
  @Inject()
  protected jwtService: JwtService

  @Inject()
  protected logger: Logger

  async $exec(ctx: { email: string; scope?: string }) {
    const user = new UserInfo({
      email: ctx.email,
      scopes: ctx.scope ? ctx.scope.split(",") : []
    })

    return [
      {
        title: "Generate token",
        task: async () => {
          const token = await this.jwtService.encode({ user })

          // display result in the terminal
          this.logger.info({
            event: "TOKEN",
            token
          })
        }
      }
    ]
  }
}
