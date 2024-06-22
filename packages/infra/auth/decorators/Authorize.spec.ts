import { Controller } from "@tsed/di"
import { Get, getSpec } from "@tsed/schema"

import { Authorize } from "./Authorize.js"

describe("@Authorize", () => {
  it("should return the correct swagger schema", () => {
    @Controller("/")
    class MyController {
      @Get("/")
      @Authorize({ scopes: ["admin"] })
      get() {}
    }

    expect(getSpec(MyController)).toMatchInlineSnapshot(
      {},
      `
      {
        "paths": {
          "/": {
            "get": {
              "operationId": "myControllerGet",
              "parameters": [],
              "responses": {
                "401": {
                  "content": {
                    "*/*": {
                      "schema": {
                        "type": "object",
                      },
                    },
                  },
                  "description": "Unauthorized",
                },
                "403": {
                  "content": {
                    "*/*": {
                      "schema": {
                        "type": "object",
                      },
                    },
                  },
                  "description": "Forbidden",
                },
              },
              "security": [
                {
                  "BearerJWT": [
                    "admin",
                  ],
                },
              ],
              "tags": [
                "MyController",
              ],
            },
          },
        },
        "tags": [
          {
            "name": "MyController",
          },
        ],
      }
    `
    )
  })
})
