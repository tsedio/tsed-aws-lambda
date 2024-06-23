import { UserInfo } from "@project/domain/users/UserInfo.js"
import { DITest } from "@tsed/di"
import { beforeEach } from "vitest"

import { JwtService } from "./JwtService.js"

describe("JwtService", () => {
  beforeEach(() =>
    DITest.create({
      envs: {
        JWT_SECRET: "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI",
        JWT_ISSUER: "https://egain.com",
        JWT_AUDIENCE: "537d714c-d062-45ef-957d-6beac6490233"
      }
    })
  )
  afterEach(() => DITest.reset())
  describe("encode()", () => {
    it("should return a JWT", async () => {
      const jwtService = await DITest.invoke<JwtService>(JwtService)

      const user = new UserInfo({
        _id: "123",
        email: "hello@egain.com",
        scopes: ["user:read"]
      })

      const result = await jwtService.encode({ user })

      expect(result).toEqual(expect.any(String))

      const decoded = await jwtService.decode(result)

      expect(decoded).toEqual({
        payload: {
          aud: "537d714c-d062-45ef-957d-6beac6490233",
          exp: expect.any(Number),
          iat: expect.any(Number),
          iss: "https://egain.com",
          user: {
            _id: "123",
            email: "hello@egain.com",
            emailVerified: false,
            scopes: ["user:read"]
          }
        },
        protectedHeader: {
          alg: "dir",
          enc: "A128CBC-HS256"
        }
      })
    })
  })
})
