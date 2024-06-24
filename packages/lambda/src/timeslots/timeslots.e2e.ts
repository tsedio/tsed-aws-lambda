import { createRequest, getAuthTokenFixture } from "@project/vitest"

describe("Timeslots", () => {
  describe("GET /timeslots", () => {
    it("should return all timeslots", async () => {
      const request = await createRequest()
      const token = await getAuthTokenFixture({
        scopes: ["timeslots"]
      })

      const response = await request.get("/timeslots").set("Authorization", `Bearer ${token}`) // .expect(200)

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

  describe("scenario 1", () => {
    it("should create a new timeslot, update it and delete and delete it", async () => {
      const request = await createRequest()
      const token = await getAuthTokenFixture({
        scopes: ["timeslots"]
      })

      const response = await request
        .post("/timeslots")
        .set("Authorization", `Bearer ${token}`)
        .send({
          start_date: "2025-01-01T00:00:00Z",
          end_date: "2025-01-01T01:00:00Z",
          label: "A test",
          description: "A test description"
        })
        .expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        end_date: "2025-01-01T01:00:00.000Z",
        label: "A test",
        description: "A test description",
        start_date: "2025-01-01T00:00:00.000Z",
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })

      const getByIdResponse = await request
        .get("/timeslots/" + response.body.id)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)

      expect(getByIdResponse.body).toEqual({
        id: expect.any(String),
        label: "A test",
        description: "A test description",
        start_date: "2025-01-01T00:00:00.000Z",
        end_date: "2025-01-01T01:00:00.000Z",
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })

      const updateResponse = await request
        .put("/timeslots/" + response.body.id)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: response.body.id,
          start_date: "2025-01-01T00:00:00Z",
          end_date: "2025-01-01T02:00:00Z",
          label: "A test",
          description: "A test description"
        })
        .expect(200)

      expect(updateResponse.body).toEqual({
        id: expect.any(String),
        label: "A test",
        description: "A test description",
        start_date: "2025-01-01T00:00:00.000Z",
        end_date: "2025-01-01T02:00:00.000Z",
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })

      const checkUpdateResponse = await request.get(`/timeslots/${response.body.id}`).set("Authorization", `Bearer ${token}`) //.expect(200)

      expect(checkUpdateResponse.body).toEqual({
        id: expect.any(String),
        label: "A test",
        description: "A test description",
        start_date: "2025-01-01T00:00:00.000Z",
        end_date: "2025-01-01T02:00:00.000Z",
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })

      await request.delete(`/timeslots/${response.body.id}`).set("Authorization", `Bearer ${token}`).expect(204)

      const checkDeleteResponse = await request.get(`/timeslots/${response.body.id}`).set("Authorization", `Bearer ${token}`).expect(404)

      expect(checkDeleteResponse.body).toEqual({
        errors: [],
        message: "Timeslot not found",
        name: "NOT_FOUND",
        status: 404
      })
    })
  })
})
