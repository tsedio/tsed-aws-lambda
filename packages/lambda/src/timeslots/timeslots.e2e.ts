import { createRequest, getAuthTokenFixture } from "@project/vitest"

describe("Timeslots", () => {
  describe("GET /timeslots", () => {
    it("should return all timeslots", async () => {
      const request = await createRequest()
      const token = await getAuthTokenFixture({
        scopes: ["timeslots"]
      })

      const response = await request.get("/timeslots").set("Authorization", `Bearer ${token}`).expect(200)

      expect(response.body).toEqual([])
    })

    it("should throw error if token is missing", async () => {
      const request = await createRequest()

      const response = await request.get("/timeslots").expect(401)

      expect(response.body).toEqual({
        errors: [],
        message: "Unauthorized",
        name: "UNAUTHORIZED",
        status: 401
      })
    })
  })
})
