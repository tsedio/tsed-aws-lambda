import { TimeslotsController } from "@project/controllers/timeslots/TimeslotsController.js"
import { PlatformServerless } from "@tsed/platform-serverless"
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing"

describe("Timeslots Handler", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [TimeslotsController]
    })
  )
  afterEach(() => PlatformServerlessTest.reset())

  describe("getTimeslots()", () => {
    it("should get timeslots", async () => {
      await PlatformServerlessTest.request.call("createTimeslot").body({
        name: "Timeslot 1",
        start_date: "2021-01-01T00:00:00.000Z",
        end_date: "2021-01-01T00:00:00.000Z",
        description: "Description"
      })

      const response = await PlatformServerlessTest.request.call("getTimeslots")

      expect(response.statusCode).toEqual(200)
      expect(response.headers).toEqual({
        "x-request-id": "requestId",
        "content-type": "application/json"
      })
      expect(JSON.parse(response.body)).toEqual([
        {
          id: expect.any(String),
          description: "Description",
          end_date: "2021-01-01T00:00:00.000Z",
          start_date: "2021-01-01T00:00:00.000Z",
          updated_at: expect.any(String),
          created_at: expect.any(String)
        }
      ])
    })
  })
})
