import { UserInfo } from "@project/domain/users/UserInfo.js"
import { DITest } from "@tsed/di"

import { AwsPolicyService } from "./AwsPolicyService.js"

describe("AwsPolicyService", () => {
  beforeEach(() => DITest.create())
  afterEach(() => DITest.reset())

  describe("generatePolicy", () => {
    it("should generate a policy (allowed)", async () => {
      const service = await DITest.invoke<AwsPolicyService>(AwsPolicyService)
      const policy = service.generateAllow("me", "Allow", {
        user: new UserInfo()
      })

      expect(policy).toEqual({
        context: {
          user: {
            emailVerified: false,
            scopes: []
          }
        },
        policyDocument: {
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: "Allow"
            }
          ],
          Version: "2012-10-17"
        },
        principalId: "me"
      })
    })
    it("should generate a policy (deny)", async () => {
      const service = await DITest.invoke<AwsPolicyService>(AwsPolicyService)
      const policy = service.generateDeny("me", "Allow", {})

      expect(policy).toEqual({
        context: {
          user: undefined
        },
        policyDocument: {
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Deny",
              Resource: "Allow"
            }
          ],
          Version: "2012-10-17"
        },
        principalId: "me"
      })
    })
  })
})
