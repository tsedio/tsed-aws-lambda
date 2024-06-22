import { useDecorators } from "@tsed/core"
import { Intercept } from "@tsed/di"
import { Returns, Security } from "@tsed/schema"

import { AuthInterceptor } from "../services/AuthInterceptor.js"

export interface AuthorizeOptions extends Record<string, unknown> {
  scopes?: string[]
}

export function Authorize(options: AuthorizeOptions) {
  return useDecorators(Intercept(AuthInterceptor, options), Security("BearerJWT", ...(options.scopes || [])), Returns(401), Returns(403))
}
