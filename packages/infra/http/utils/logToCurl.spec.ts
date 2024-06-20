import { logToCurl } from "./logToCurl.js"

describe("logToCurl", () => {
  it("should get correct curl", () => {
    const curl = logToCurl({
      url: "http://localhost:3000/endpoint",
      method: "get",
      params: { id: 1 },
      headers: { "Content-Type": "application/json" }
    } as never)
    expect(curl).toEqual(`curl -X GET 'http://localhost:3000/endpoint?id=1' -H 'Content-Type: application/json'`)
  })
  it("should get correct curl without headers", () => {
    const curl = logToCurl({
      response: {
        config: {
          baseURL: "http://localhost:3000/",
          headers: { "Content-Type": "application/json" }
        }
      },
      url: "/endpoint",
      params: { id: 1 },
      data: { b: 2 }
    } as never)
    expect(curl).toBe(`curl -X POST 'http://localhost:3000//endpoint?id=1' -d '{"b":2}' -H 'Content-Type: application/json'`)
  })
})
