#!/usr/bin/env node
import { CliCore } from "@tsed/cli-core"
import { GenerateSwaggerCmd } from "@tsed/cli-generate-swagger"

import { config } from "../config/index.js"
import { Server } from "../Server.js"

CliCore.bootstrap({
  ...config,
  server: Server,
  // add your custom commands here
  commands: [GenerateSwaggerCmd]
}).catch(console.error)
