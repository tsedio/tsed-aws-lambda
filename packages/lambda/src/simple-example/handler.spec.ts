import { handler } from "./handler.js";

describe("Handler", () => {
  it("should return hello world", () => {
    const spy = vi.fn();
    const event = {
      id: "id"
    };

    const context = {
      id: "id"
    };

    handler(event, context, spy);

    expect(spy).toHaveBeenCalledWith({
      body: '{"message":"Hello, world!","input":{"id":"id"}}',
      statusCode: 200
    });
  });
});
