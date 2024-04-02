import { Timeslot } from "@project/domain/timeslots/Timeslot";
import { DITest } from "@tsed/di";
import { beforeEach } from "vitest";

import { TimeslotsRepository } from "./TimeslotsRepository.js";

async function getServiceFixture() {
  const service = await DITest.invoke<TimeslotsRepository>(TimeslotsRepository, []);

  return { service };
}

describe("TimeslotsRepository", () => {
  beforeEach(async () => {
    await DITest.create();
    vi.useFakeTimers({ now: new Date("2021-01-01T00:10:00.000Z") });
  });
  afterEach(async () => {
    await DITest.reset();
    vi.useRealTimers();
  });

  describe("getById()", () => {
    it("should return the timeslot with the given id", async () => {
      const { service } = await getServiceFixture();

      const timeslot = new Timeslot();
      timeslot.label = "Hiking";
      timeslot.description = "Hiking in the mountains";
      timeslot.startDate = new Date("2021-01-01T10:00:00.000Z");
      timeslot.endDate = new Date("2021-01-01T11:00:00.000Z");

      const newTimeslot = await service.create(timeslot);

      const result = await service.getById(newTimeslot.id);

      expect(result).toEqual(newTimeslot);
      expect(result?.createdAt).toEqual(new Date("2021-01-01T00:10:00.000Z"));
      expect(result?.updatedAt).toEqual(new Date("2021-01-01T00:10:00.000Z"));
    });

    it("should not return a timeslot when the given id is unknown", async () => {
      const { service } = await getServiceFixture();

      const result = await service.getById("id");

      expect(result).toEqual(undefined);
    });
  });
});
