#!/usr/bin/env node
import { CliCore } from "@tsed/cli-core"

import { config } from "../config"
import { TimeslotsCommand } from "../timeslots/TimeslotsCommand"
import { TimeslotsLoadCommand } from "../timeslots/TimeslotsLoadCommand"

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [TimeslotsCommand, TimeslotsLoadCommand]
  // add additional config settings here
}).catch(console.error)
