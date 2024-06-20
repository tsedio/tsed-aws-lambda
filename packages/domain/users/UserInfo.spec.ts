import { getJsonSchema } from "@tsed/schema"

import { UserInfo } from "./UserInfo.js"

describe("UserInfo", () => {
  it("should create user info instance", () => {
    expect(
      new UserInfo({
        _id: "id",
        email: "email"
      })
    ).toEqual({
      _id: "id",
      email: "email",
      emailVerified: false,
      firstname: undefined,
      lastname: undefined,
      scopes: []
    })
  })
  it("should generate the json schema", () => {
    expect(getJsonSchema(UserInfo)).toMatchInlineSnapshot(`
      {
        "properties": {
          "email": {
            "format": "email",
            "minLength": 1,
            "type": "string",
          },
          "emailVerified": {
            "default": false,
            "type": "boolean",
          },
          "firstname": {
            "examples": [
              "Jack",
            ],
            "minLength": 1,
            "type": "string",
          },
          "id": {
            "minLength": 1,
            "type": "string",
          },
          "lastname": {
            "examples": [
              "Sparrow",
            ],
            "minLength": 1,
            "type": "string",
          },
          "scopes": {
            "examples": [
              [
                "openid",
                "profile",
              ],
            ],
            "items": {
              "type": "string",
            },
            "type": "array",
          },
        },
        "required": [
          "id",
          "email",
          "emailVerified",
          "scopes",
          "lastname",
          "firstname",
        ],
        "type": "object",
      }
    `)
  })
})
