import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { DITest } from "@tsed/di"

import { TimeslotsCommand } from "./TimeslotsCommand.js"

async function getFixture() {
  const timeslotsRepository = {
    getAll: vi.fn()
  }

  const command = await DITest.invoke(TimeslotsCommand, [
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

describe("TimeslotsCommand", () => {
  beforeEach(() =>
    DITest.create({
      envs: {
        MAX_TIMESLOTS: 6
      }
    })
  )
  afterEach(() => DITest.reset())

  describe("$mapContext()", () => {
    it("should return the context with the limit", async () => {
      const { command } = await getFixture()

      const result = command.$mapContext({ limit: 10 })

      expect(result).toEqual({
        limit: 6
      })
    })
    it("should return the context with the default limit", async () => {
      const { command } = await getFixture()

      const result = command.$mapContext({})

      expect(result).toEqual({
        limit: 6
      })
    })
    it("should return the context with the given limit", async () => {
      const { command } = await getFixture()

      const result = command.$mapContext({
        limit: 5
      })

      expect(result).toEqual({
        limit: 5
      })
    })
  })

  describe("$exec()", () => {
    it("should return a task to get all timeslots", async () => {
      const { command, timeslotsRepository } = await getFixture()

      const result = await command.$exec(command.$mapContext({ limit: 10 }))

      expect(result).toEqual([
        {
          title: "Get all timeslots",
          task: expect.any(Function)
        }
      ])

      await result[0].task()

      expect(timeslotsRepository.getAll).toHaveBeenCalledWith({
        limit: 6
      })
    })
  })
})
