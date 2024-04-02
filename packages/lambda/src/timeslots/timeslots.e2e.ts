import { invokeLambda } from "@project/vitest";

describe("Timeslots", () => {
  describe("GET /timeslots", () => {
    it("should return all timeslots", async () => {
      const functionName = "get_timeslots";

      const { statusCode, data } = await invokeLambda(functionName, {});

      expect(statusCode).toEqual(200);
      expect(data).toEqual([]);
    });
  });
});
