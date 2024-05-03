import "@tsed/ajv" // enable validation

import { TimeslotsController } from "@project/controllers/timeslots/TimeslotsController.js"
import { PlatformServerless } from "@tsed/platform-serverless"

// shared configuration
const config = {
  timeslots: {
    // Not applicable here because lambda are packaged and deployed on AWS.
    // For this reason, we can't use the file system to store data (prefer S3, DynamoDB, etc.)
    // dbFilePath: join(import.meta.dirname, "../../../../.tmp/timeslots.json")
  }
}

export const getTimeslots = PlatformServerless.callback(TimeslotsController, "getTimeslots", config)
export const getTimeslotById = PlatformServerless.callback(TimeslotsController, "getTimeslotById", config)
