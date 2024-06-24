import { faker } from "@faker-js/faker"
import { Timeslot } from "@project/domain/timeslots/Timeslot.js"
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { Command, CommandProvider, Inject, Logger, QuestionOptions } from "@tsed/cli-core"
import { deserialize } from "@tsed/json-mapper"

interface CommandOptions {
  clear?: boolean
  numberOfTimeslots?: number
}

@Command({
  name: "timeslots-load",
  description: "Preload timeslots into the database",
  options: {
    "-c, --clear": {
      type: Boolean,
      defaultValue: false,
      description: "Clear all timeslots before loading new ones"
    },
    "-n, --numberOfTimeslots <numberOfTimeslots>": {
      type: Number,
      defaultValue: 10,
      description: "Number of timeslots to load"
    }
  }
})
export class TimeslotsLoadCommand implements CommandProvider<CommandOptions> {
  @Inject(TimeslotsRepository)
  protected timeslotsRepository: TimeslotsRepository

  @Inject()
  protected logger: Logger

  $prompt(initialOptions: Partial<CommandOptions>): QuestionOptions<CommandOptions> {
    return [
      {
        type: "confirm",
        name: "clear",
        message: "Do you want to clear all timeslots before loading new ones?",
        initial: initialOptions.clear,
        when: !!initialOptions.clear
      }
    ]
  }

  $exec(ctx: CommandOptions) {
    return [
      {
        title: "Clear all timeslots",
        enabled: ctx.clear,
        task: async () => {
          await this.timeslotsRepository.clear()
        }
      },
      {
        title: "Load timeslots",
        task: async () => {
          const timeslots = this.generateTimeslots(ctx)

          for (const timeslot of timeslots) {
            await this.timeslotsRepository.create(timeslot)
          }

          this.logger.info({
            event: "TIMESLOTS_CREATION",
            count: timeslots.length
          })
        }
      }
    ]
  }

  private generateTimeslots(ctx: CommandOptions) {
    return new Array(ctx.numberOfTimeslots).fill(0).map(() => {
      const start = faker.date.recent()

      return deserialize<Timeslot>(
        {
          label: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          startDate: start,
          endDate: faker.date.future({ refDate: start })
        },
        { type: Timeslot, useAlias: false }
      )
    })
  }
}
