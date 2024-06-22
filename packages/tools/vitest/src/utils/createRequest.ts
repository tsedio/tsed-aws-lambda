import { join } from "node:path"

import { execaSync } from "execa"
import supertest from "supertest"

export async function createRequest() {
  const apiUrl = execaSync("terraform", ["output", "-raw", "api_url"], {
    cwd: join(process.cwd(), "terraform")
  })

  return supertest(apiUrl.stdout.trim())
}
