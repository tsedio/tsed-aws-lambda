import { catchAsyncError } from "@tsed/core"
import { DITest } from "@tsed/di"
import { Exception } from "@tsed/exceptions"

import { AuthContext } from "./AuthContext.js"
import { AuthInterceptor } from "./AuthInterceptor.js"

async function getInterceptorFixture(opts: { scopes?: string[] }) {
  const authContext = {
    getUserInfo: vi.fn().mockResolvedValue({
      scopes: ["timeslots"]
    })
  }

  const interceptor = await DITest.invoke(AuthInterceptor, [
    {
      token: AuthContext,
      use: authContext
    }
  ])

  const context = {
    options: { scopes: opts.scopes },
    next: vi.fn().mockResolvedValue([])
  }

  return { interceptor, context, authContext }
}

describe("AuthInterceptor", () => {
  beforeEach(() => DITest.create())
  afterEach(() => DITest.reset())

  it("should call the intercepted method", async () => {
    const { interceptor, context } = await getInterceptorFixture({
      scopes: ["timeslots"]
    })

    const result = await interceptor.intercept(context)

    expect(result).toEqual([])
    expect(context.next).toHaveBeenCalledWith()
  })

  it("should throw an error if user is undefined", async () => {
    const { interceptor, context, authContext } = await getInterceptorFixture({
      scopes: []
    })

    authContext.getUserInfo.mockResolvedValue(undefined)

    const result = await catchAsyncError<Exception>(() => interceptor.intercept(context))

    expect(result?.status).toEqual(401)
    expect(result?.message).toEqual("Unauthorized")
  })
  it("should throw an error if scope doesn't match the given scope option", async () => {
    const { interceptor, context } = await getInterceptorFixture({
      scopes: ["hello"]
    })

    const result = await catchAsyncError<Exception>(() => interceptor.intercept(context))

    expect(result?.status).toEqual(403)
    expect(result?.message).toEqual("Insufficient scope")
  })
})
