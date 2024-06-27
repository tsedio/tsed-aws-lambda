import { Description, Example, Format, MaxLength, MinLength, Name, Required } from "@tsed/schema"

import { AllowEmpty } from "../decorators/AllowEmpty.js"
import { BaseDocument } from "../document/BaseDocument.js"

export class Timeslot extends BaseDocument {
  @Required()
  @Name("start_date")
  @Format("date-time")
  startDate: Date

  @Required()
  @Name("end_date")
  @Format("date-time")
  endDate: Date

  @Required()
  @Example("Hiking")
  @MinLength(3)
  @MaxLength(100)
  label: string

  @Required()
  @AllowEmpty()
  @Description("Activity or Dresscode in HTML format")
  @MinLength(3)
  @MaxLength(500)
  description: string = ""
}
