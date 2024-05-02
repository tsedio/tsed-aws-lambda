import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { Command, CommandProvider, Inject, Logger } from "@tsed/cli-core"

export interface TimeslotsCommandProps {
  all: boolean
}

@Command({
  name: "timeslots",
  description: "A simple hello command",
  options: {
    "-a, --all": {
      type: Boolean,
      defaultValue: false,
      description: "Display all timeslots"
    }
  }
})
export class TimeslotsCommand implements CommandProvider<TimeslotsCommandProps> {
  @Inject()
  protected timeslotsRepository: TimeslotsRepository

  @Inject()
  protected logger: Logger

  $exec(ctx: TimeslotsCommandProps) {
    return [
      {
        title: "Get all timeslots",
        enabled: ctx.all,
        task: async () => {
          const timeslots = await this.timeslotsRepository.getAll()

          // display result in the terminal
          this.logger.info({
            event: "TIMESLOTS",
            timeslots
          })
        }
      }
    ]
  }
}
