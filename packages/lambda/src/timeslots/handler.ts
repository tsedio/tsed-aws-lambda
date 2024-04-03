import "@tsed/ajv" // enable validation

import { TimeslotsController } from "@project/controllers/timeslots/TimeslotsController.js"
import { PlatformServerless } from "@tsed/platform-serverless"

export const getTimeslots = PlatformServerless.callback(TimeslotsController, "getTimeslots")
export const getTimeslotById = PlatformServerless.callback(TimeslotsController, "getTimeslotById")
