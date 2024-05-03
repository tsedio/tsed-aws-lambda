#!/usr/bin/env node
import { CliCore } from "@tsed/cli-core"

import { config } from "../config/index.js"
import { TimeslotsCommand } from "../timeslots/TimeslotsCommand.js"
import { TimeslotsLoadCommand } from "../timeslots/TimeslotsLoadCommand.js"

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [TimeslotsCommand, TimeslotsLoadCommand]
  // add additional config settings here
}).catch(console.error)
