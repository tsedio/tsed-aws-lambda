import { TimeslotsController } from "@project/controllers/timeslots/TimeslotsController";
import { PlatformServerlessTest } from "@tsed/platform-serverless-testing";
import { beforeEach } from "vitest";

describe("Timeslots Handler", () => {
  beforeEach(() =>
    PlatformServerlessTest.create({
      lambda: [TimeslotsController]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  it("should get timeslots", async () => {
    console.log(PlatformServerlessTest.callbacks);
    const response = await PlatformServerlessTest.request.call("getTimeslots");

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({
      "x-request-id": "requestId",
      "content-type": "application/json"
    });
    expect(JSON.parse(response.body)).toEqual([]);
  });
});
