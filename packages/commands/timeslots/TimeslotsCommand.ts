import {TimeslotsRepository} from "@project/infra/timeslots/TimeslotsRepository.js";
import {Command, CommandProvider, Constant, Inject, logger} from "@tsed/cli-core";

interface CommandOptions {
  limit?: number;
}

@Command({
  name: "timeslots",
  description: "A simple hello command",
  options: {
    "-l, --limit <limit>": {
      type: Number,
      defaultValue: undefined,
      description: "Max timeslots to display in the response"
    }
  }
})
export class TimeslotsCommand implements CommandProvider<CommandOptions> {
  @Inject(TimeslotsRepository)
  protected timeslotsRepository: TimeslotsRepository;

  @Constant("envs.MAX_TIMESLOTS", 5)
  protected maxTimeslots: number;

  $mapContext(ctx: Partial<CommandOptions>): CommandOptions {
    return {
      ...ctx,
      limit: Math.min(this.maxTimeslots, ctx.limit || this.maxTimeslots)
    };
  }

  $exec(ctx: CommandOptions) {
    return [
      {
        title: "Get all timeslots",
        task: async () => {
          const timeslots = await this.timeslotsRepository.getAll({
            limit: ctx.limit
          });

          // display result in the terminal
          logger().info({
            event: "TIMESLOTS",
            limit: ctx.limit,
            timeslots
          });
        }
      }
    ];
  }
}
