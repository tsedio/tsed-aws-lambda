import { deserialize } from "@tsed/json-mapper"
import { getJsonSchema } from "@tsed/schema"
import { afterEach, beforeEach } from "vitest"

import { Timeslot } from "./Timeslot.js"

describe("Timeslot", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2024-04-02T07:03:28.388Z") })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  describe("json schema", () => {
    it("should return the expected json schema", () => {
      expect(getJsonSchema(Timeslot)).toMatchSnapshot()
    })
  })

  describe("deserialize()", () => {
    it("should deserialize the given data", () => {
      const result = deserialize<Timeslot>(
        {
          id: "id",
          label: "Hiking",
          start_date: "2021-01-01T10:00:00.000Z",
          end_date: "2021-01-01T11:00:00.000Z"
        },
        {
          type: Timeslot
        }
      )

      expect(result).toBeInstanceOf(Timeslot)
      expect(result).toEqual({
        description: "",
        id: "id",
        label: "Hiking",
        startDate: new Date("2021-01-01T10:00:00.000Z"),
        endDate: new Date("2021-01-01T11:00:00.000Z"),
        createdAt: new Date("2024-04-02T07:03:28.388Z"),
        updatedAt: new Date("2024-04-02T07:03:28.388Z")
      })
    })
  })
})
