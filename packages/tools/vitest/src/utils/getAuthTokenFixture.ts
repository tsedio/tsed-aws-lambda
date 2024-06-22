import { join } from "node:path"

import { faker } from "@faker-js/faker"
import { UserInfo } from "@project/domain/users/UserInfo.js"
import { JwtService } from "@project/infra/auth/services/JwtService.js"
import { InjectorService } from "@tsed/di"
import { execaSync } from "execa"

export async function getAuthTokenFixture(userOpts: Partial<UserInfo> = {}) {
  const apiHost = execaSync("terraform", ["output", "-raw", "api_host"], {
    cwd: join(process.cwd(), "terraform")
  })

  const injector = new InjectorService()
  injector.settings.set("envs", {
    NODE_ENV: "development",
    JWT_SECRET: "zH4NRP1HMALxxCFnRZABFA7GOJtzU_gIj02alfL1lvI",
    JWT_ISSUER: apiHost.stdout.trim(),
    JWT_AUDIENCE: "urn:aud:developer"
  })

  injector.addProvider(JwtService)

  const jwtService = injector.invoke<JwtService>(JwtService)
  const user = new UserInfo({
    _id: faker.string.uuid(),
    email: faker.internet.email(),
    lastname: faker.person.lastName(),
    firstname: faker.person.lastName(),
    emailVerified: true,
    scopes: [],
    ...userOpts
  })

  return jwtService.encode({ user })
}
