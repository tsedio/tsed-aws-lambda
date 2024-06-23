import { UserInfo } from "@project/domain/users/UserInfo.js"
import { Inject, Injectable, InterceptorContext, InterceptorMethods } from "@tsed/di"
import { Forbidden, Unauthorized } from "@tsed/exceptions"

import { AuthContext } from "./AuthContext.js"

@Injectable()
export class AuthInterceptor implements InterceptorMethods {
  @Inject()
  protected authContext: AuthContext

  async intercept(context: InterceptorContext<unknown, { scopes: string[] }>) {
    const user = await this.authContext.getUserInfo()

    if (!user) {
      throw new Unauthorized("Unauthorized")
    }

    if (context.options?.scopes && !this.checkScopes(user, context.options.scopes)) {
      throw new Forbidden("Insufficient scope")
    }

    return context.next()
  }

  checkScopes(user: UserInfo, scopes: string[]) {
    return scopes.every((scope) => user.scopes.includes(scope))
  }
}
