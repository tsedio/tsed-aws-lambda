import { dirname } from "node:path"

import { Timeslot } from "@project/domain/timeslots/Timeslot.js"
import { DITest } from "@tsed/di"
import fs from "fs-extra"
import { beforeEach } from "vitest"

import { TimeslotsRepository } from "./TimeslotsRepository.js"

vi.mock("fs-extra")

async function getServiceFixture() {
  const service = await DITest.invoke<TimeslotsRepository>(TimeslotsRepository, [])

  return { service }
}

describe("TimeslotsRepository", () => {
  describe("$onInit", () => {
    beforeEach(async () => {
      vi.mocked(fs.readJson as unknown as () => Promise<unknown[]>).mockResolvedValue([
        {
          id: "id",
          label: "Hiking",
          description: "Hiking in the mountains",
          start_date: "2021-01-01T10:00:00.000Z",
          end_date: "2021-01-01T11:00:00.000Z",
          created_at: "2021-01-01T00:00:00.000Z",
          updated_at: "2021-01-01T00:00:00.000Z"
        }
      ])

      await DITest.create({
        timeslots: {
          dbFilePath: "./dir/timeslots.json"
        }
      })

      vi.useFakeTimers({ now: new Date("2021-01-01T00:10:00.000Z") })
    })
    afterEach(async () => {
      await DITest.reset()
      vi.useRealTimers()
    })

    it("should check if the file exists and create it", async () => {
      const repository = await DITest.get(TimeslotsRepository, [])

      expect(fs.existsSync).toHaveBeenCalledWith("./dir/timeslots.json")
      expect(fs.ensureDir).toHaveBeenCalledWith(dirname("./dir/timeslots.json"))
      expect(fs.writeJson).toHaveBeenCalledWith("./dir/timeslots.json", [])
      expect(fs.readJson).toHaveBeenCalledWith("./dir/timeslots.json", {
        encoding: "utf-8"
      })

      expect(repository.cache.size).toBe(1)

      const timeslot = repository.cache.get("id")

      repository.save(timeslot)

      expect(fs.writeJson).toHaveBeenCalledWith(
        "./dir/timeslots.json",
        [
          {
            created_at: "2021-01-01T00:00:00.000Z",
            description: "Hiking in the mountains",
            end_date: "2021-01-01T11:00:00.000Z",
            id: "id",
            label: "Hiking",
            start_date: "2021-01-01T10:00:00.000Z",
            updated_at: "2021-01-01T00:10:00.000Z"
          }
        ],
        {
          EOL: "\n",
          spaces: 2
        }
      )
    })
  })
  describe("methods", () => {
    beforeEach(async () => {
      await DITest.create()
      vi.useFakeTimers({ now: new Date("2021-01-01T00:10:00.000Z") })
    })
    afterEach(async () => {
      await DITest.reset()
      vi.useRealTimers()
    })

    describe("getById()", () => {
      it("should return the timeslot with the given id", async () => {
        const { service } = await getServiceFixture()

        const timeslot = new Timeslot()
        timeslot.label = "Hiking"
        timeslot.description = "Hiking in the mountains"
        timeslot.startDate = new Date("2021-01-01T10:00:00.000Z")
        timeslot.endDate = new Date("2021-01-01T11:00:00.000Z")

        const newTimeslot = await service.create(timeslot)

        const result = await service.getById(newTimeslot.id)

        expect(result).toEqual(newTimeslot)
        expect(result?.createdAt).toEqual(new Date("2021-01-01T00:10:00.000Z"))
        expect(result?.updatedAt).toEqual(new Date("2021-01-01T00:10:00.000Z"))
      })

      it("should not return a timeslot when the given id is unknown", async () => {
        const { service } = await getServiceFixture()

        const result = await service.getById("id")

        expect(result).toEqual(undefined)
      })
    })
  })
})
