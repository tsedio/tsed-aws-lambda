import { FsTimeslotsRepository } from "@project/infra/timeslots/FsTimeslotsRepository.js"
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { Logger } from "@tsed/cli-core"
import { CliPlatformTest } from "@tsed/cli-testing"

import { TimeslotsCommand } from "../timeslots/TimeslotsCommand.js"
import { TimeslotsLoadCommand } from "../timeslots/TimeslotsLoadCommand.js"

describe("Timeslots: integration", () => {
  beforeEach(() => {
    return CliPlatformTest.bootstrap({
      commands: [TimeslotsLoadCommand, TimeslotsCommand],
      argv: [],
      imports: [
        {
          token: TimeslotsRepository,
          useClass: FsTimeslotsRepository
        }
      ]
    })
  })
  afterEach(() => CliPlatformTest.reset())

  it("should load timeslots and return loaded timeslots", async () => {
    const logger = CliPlatformTest.get<Logger>(Logger)
    vi.spyOn(logger, "info").mockReturnValue(undefined as never)

    await CliPlatformTest.exec("timeslots-load", {
      clear: false,
      numberOfTimeslots: 10
    })

    expect(logger.info).toHaveBeenCalledWith({
      count: 10,
      event: "TIMESLOTS_CREATION"
    })

    await CliPlatformTest.exec("timeslots", {
      limit: 5
    })

    const timeslots = CliPlatformTest.get<TimeslotsRepository>(TimeslotsRepository)

    expect(logger.info).toHaveBeenCalledWith({
      event: "TIMESLOTS",
      limit: 5,
      timeslots: await timeslots.getAll({ limit: 5 })
    })
  })
})
