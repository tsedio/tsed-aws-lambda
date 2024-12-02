import { BaseContext, configuration } from "@tsed/di"
import { defaultAlterLog } from "@tsed/platform-log-request"
import type { ServerlessContext } from "@tsed/platform-serverless"

// configure the logger for the serverless context
configuration().set("logger.alterLog", (level: string, obj: Record<string, unknown>, ctx: ServerlessContext) => {
  const defaultLog = defaultAlterLog(level, obj, ctx as unknown as BaseContext) // will be fixed with rc.3

  return {
    ...defaultLog,
    aws_event: ctx.event,
    aws_context: ctx.context
  }
})
