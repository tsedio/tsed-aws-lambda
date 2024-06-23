import { TimeslotsController } from "@project/controllers/timeslots/TimeslotsController.js"
import { UserInfo } from "@project/domain/users/UserInfo.js"
import { JwtService } from "@project/infra/auth/services/JwtService.js"
import { PlatformServerless } from "@tsed/platform-serverless"
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing"

async function getTokenFixture() {
  const jwtService = await PlatformServerlessTest.invoke<JwtService>(JwtService)
  const user = new UserInfo({
    scopes: ["timeslots"]
  })

  return jwtService.encode({
    user
  })
}

describe("Timeslots Handler", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      envs: {
        JWT_SECRET: "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI",
        JWT_ISSUER: "https://egain.com",
        JWT_AUDIENCE: "537d714c-d062-45ef-957d-6beac6490233"
      },
      lambda: [TimeslotsController]
    })
  )
  afterEach(() => PlatformServerlessTest.reset())

  describe("getTimeslots()", () => {
    it("should get timeslots", async () => {
      const token = await getTokenFixture()

      await PlatformServerlessTest.request
        .call("createTimeslot")
        .body({
          name: "Timeslot 1",
          start_date: "2021-01-01T00:00:00.000Z",
          end_date: "2021-01-01T00:00:00.000Z",
          description: "Description"
        })
        .headers({
          authorization: `Bearer ${token}`
        })

      const response = await PlatformServerlessTest.request.call("getTimeslots").headers({
        authorization: `Bearer ${token}`
      })

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
    it("should throw a 401 error if user isn't granted", async () => {
      await PlatformServerlessTest.request.call("createTimeslot").body({
        name: "Timeslot 1",
        start_date: "2021-01-01T00:00:00.000Z",
        end_date: "2021-01-01T00:00:00.000Z",
        description: "Description"
      })

      const response = await PlatformServerlessTest.request.call("getTimeslots")

      expect(response.statusCode).toEqual(401)
      expect(response.headers).toEqual({
        "x-request-id": "requestId",
        "content-type": "application/json"
      })
      expect(JSON.parse(response.body)).toEqual({
        errors: [],
        message: "Unauthorized",
        name: "UNAUTHORIZED",
        status: 401
      })
    })
  })
})
