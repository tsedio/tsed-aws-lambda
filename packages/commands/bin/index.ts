#!/usr/bin/env node
import "@project/infra/timeslots/FsTimeslotsRepository.js"

import { FsTimeslotsRepository } from "@project/infra/timeslots/FsTimeslotsRepository.js"
import { TimeslotsRepository } from "@project/infra/timeslots/TimeslotsRepository.js"
import { CliCore } from "@tsed/cli-core"

import { config } from "../config/index.js"
import { TimeslotsCommand } from "../timeslots/TimeslotsCommand.js"
import { TimeslotsLoadCommand } from "../timeslots/TimeslotsLoadCommand.js"
import { GenerateTokenCmd } from "../token/GenerateTokenCmd.js"

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [TimeslotsCommand, TimeslotsLoadCommand, GenerateTokenCmd],
  imports: [
    {
      token: TimeslotsRepository,
      useClass: FsTimeslotsRepository
    }
  ]
  // add additional config settings here
}).catch(console.error)
