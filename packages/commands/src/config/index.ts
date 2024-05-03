import { join } from "node:path"

import { readFileSync } from "fs"

import { envs } from "./envs/index.js"

const pkg = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }))

export const config: Partial<TsED.Configuration> = {
  version: pkg.version,
  envs,
  // additional shared configuration,
  timeslots: {
    dbFilePath: join(import.meta.dirname, "../../../../.tmp/timeslots.json")
  }
}
