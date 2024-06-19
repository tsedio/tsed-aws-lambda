import { Timeslot } from "@project/domain/timeslots/Timeslot.js"
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { DITest } from "@tsed/di"

import { TimeslotsLoadCommand } from "./TimeslotsLoadCommand.js"

async function getFixture() {
  const timeslotsRepository = {
    clear: vi.fn(),
    create: vi.fn()
  }

  const command = await DITest.invoke(TimeslotsLoadCommand, [
    {
      token: TimeslotsRepository,
      use: timeslotsRepository
    }
  ])

  return {
    command,
    timeslotsRepository
  }
}

describe("TimeslotsLoadCommand", () => {
  beforeEach(() => DITest.create())
  afterEach(() => DITest.reset())

  describe("$prompt()", () => {
    it("should return a question - clear option true", async () => {
      const { command } = await getFixture()

      const result = command.$prompt({ clear: true })

      expect(result).toEqual([
        {
          type: "confirm",
          name: "clear",
          message: "Do you want to clear all timeslots before loading new ones?",
          initial: true,
          when: true
        }
      ])
    })
    it("should return a question - clear option false", async () => {
      const { command } = await getFixture()

      const result = command.$prompt({ clear: false })

      expect(result).toEqual([
        {
          type: "confirm",
          name: "clear",
          message: "Do you want to clear all timeslots before loading new ones?",
          initial: false,
          when: false
        }
      ])
    })
  })
  describe("$exec()", () => {
    it("should load timeslots", async () => {
      const { command, timeslotsRepository } = await getFixture()

      const ctx = {
        clear: true,
        numberOfTimeslots: 5
      }

      const result = await command.$exec(ctx)

      expect(result).toEqual([
        {
          title: "Clear all timeslots",
          enabled: true,
          task: expect.any(Function)
        },
        {
          title: "Load timeslots",
          task: expect.any(Function)
        }
      ])

      await result[0].task()

      expect(timeslotsRepository.clear).toHaveBeenCalledWith()

      await result[1].task()

      expect(timeslotsRepository.create).toHaveBeenCalledTimes(5)
      expect(timeslotsRepository.create).toHaveBeenCalledWith(expect.any(Timeslot))
    })
  })
})
