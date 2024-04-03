import { Timeslot } from "@project/domain/timeslots/Timeslot"
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository"
import { catchAsyncError } from "@tsed/core"
import { DITest } from "@tsed/di" // we use DITest to be agnostic with the Serverless/Web platform as much is possible
import { NotFound } from "@tsed/exceptions"
import { deserialize } from "@tsed/json-mapper"
import { getSpec, SpecTypes } from "@tsed/schema"

import { TimeslotsController } from "./TimeslotsController"

async function getControllerFixture() {
  const timeslot = deserialize<Timeslot>(
    {
      id: "uuid",
      label: "Timeslot 1"
    },
    { useAlias: false, type: Timeslot }
  )
  const repository = {
    getAll: vi.fn().mockResolvedValue([timeslot]),
    getById: vi.fn().mockResolvedValue(timeslot),
    save: vi.fn().mockResolvedValue(timeslot),
    create: vi.fn().mockResolvedValue(timeslot)
  }

  const controller = await DITest.invoke<TimeslotsController>(TimeslotsController, [
    {
      token: TimeslotsRepository,
      use: repository
    }
  ])

  return {
    controller,
    repository,
    timeslot
  }
}

describe("TimeslotsController", () => {
  beforeEach(() => DITest.create())
  afterEach(() => DITest.reset())

  describe("OAS3", () => {
    it("should generate the expected OpenAPI document", async () => {
      const result = getSpec(TimeslotsController, {
        specType: SpecTypes.OPENAPI
      })

      expect(result).toMatchSnapshot()
    })
  })

  describe("getTimeslots()", () => {
    it("should return the list of timeslots", async () => {
      const { timeslot, controller, repository } = await getControllerFixture()

      const result = await controller.getTimeslots()

      expect(repository.getAll).toHaveBeenCalledWith()
      expect(result).toEqual([timeslot])
    })
  })

  describe("getTimeslotById()", () => {
    it("should return the timeslot from his given id", async () => {
      const { timeslot, controller, repository } = await getControllerFixture()

      const result = await controller.getTimeslotById("uuid")

      expect(repository.getById).toHaveBeenCalledWith("uuid")
      expect(result).toEqual(timeslot)
    })

    it("should throw a not found error when the given id isn't known", async () => {
      const { controller, repository } = await getControllerFixture()

      repository.getById.mockResolvedValue(undefined)

      const error = await catchAsyncError<NotFound>(() => controller.getTimeslotById("uuid"))

      expect(repository.getById).toHaveBeenCalledWith("uuid")
      expect(error).toBeInstanceOf(NotFound)
      expect(error?.message).toEqual("Timeslot not found")
    })
  })

  describe("createTimeslot()", () => {
    it("should create a new timeslot", async () => {
      const { timeslot, controller, repository } = await getControllerFixture()

      const result = await controller.createTimeslot(timeslot)

      expect(repository.create).toHaveBeenCalledWith(timeslot)
      expect(result).toEqual(timeslot)
    })
  })

  describe("updateTimeslot()", () => {
    it("should update a timeslot", async () => {
      const { timeslot, controller, repository } = await getControllerFixture()

      const result = await controller.updateTimeslot(timeslot.id, timeslot)

      expect(repository.save).toHaveBeenCalledWith(timeslot)
      expect(result).toEqual(timeslot)
    })

    it("should throw a not found error when the given id isn't known", async () => {
      const { timeslot, controller, repository } = await getControllerFixture()

      repository.getById.mockResolvedValue(undefined)

      const error = await catchAsyncError<NotFound>(() => controller.updateTimeslot("uuid", timeslot))

      expect(repository.getById).toHaveBeenCalledWith(timeslot.id)
      expect(error).toBeInstanceOf(NotFound)
      expect(error?.message).toEqual("Timeslot not found")
    })
  })
})
