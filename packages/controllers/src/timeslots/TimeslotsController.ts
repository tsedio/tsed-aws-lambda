import { Timeslot } from "@project/domain/timeslots/Timeslot";
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository";
import { BodyParams, Put } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { PathParams } from "@tsed/platform-params";
import { Format, Get, Groups, JsonFormatTypes, Post, Returns } from "@tsed/schema";

@Controller("/timeslots")
export class TimeslotsController {
  @Inject()
  protected repository: TimeslotsRepository;

  @Get("/")
  @Returns(200, Array).Of(Timeslot)
  getTimeslots() {
    return this.repository.getAll();
  }

  @Get("/:id")
  @Returns(200, Timeslot)
  @Returns(404).Description("Timeslot not found")
  async getTimeslotById(@PathParams("id") @Format(JsonFormatTypes.UUID) id: string) {
    const result = await this.repository.getById(id);

    if (!result) {
      throw new NotFound("Timeslot not found");
    }

    return result;
  }

  @Post("/")
  @Returns(201, Timeslot)
  async createTimeslot(@BodyParams() @Groups("create") payload: Timeslot) {
    return this.repository.create(payload);
  }

  @Put("/:id")
  @Returns(200, Timeslot)
  @Returns(404).Description("Timeslot not found")
  async updateTimeslot(@PathParams("id") @Format(JsonFormatTypes.UUID) id: string, @BodyParams() @Groups("update") payload: Timeslot) {
    // check if the timeslot exists
    await this.getTimeslotById(id);

    payload.id = id;

    return this.repository.save(payload);
  }
}
