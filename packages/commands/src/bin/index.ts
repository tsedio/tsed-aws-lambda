#!/usr/bin/env node
import { CliCore } from "@tsed/cli-core"
import { config } from "dotenv"

import { TimeslotsCommand } from "../timeslots/TimeslotsCommand.js"

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [TimeslotsCommand]
  // add additional config settings here
}).catch(console.error)
