import { Description, Example, Format, Groups, JsonFormatTypes, MaxLength, MinLength, Name, Required, RequiredGroups } from "@tsed/schema";

import { AllowEmpty } from "../decorators/AllowEmpty.js";

export class Timeslot {
  @Format(JsonFormatTypes.UUID)
  @Required()
  @RequiredGroups("update")
  id: string;

  @Required()
  @Name("start_date")
  @Format("date-time")
  startDate: Date;

  @Required()
  @Name("end_date")
  @Format("date-time")
  endDate: Date;

  @Required()
  @Example("Hiking")
  @MinLength(3)
  @MaxLength(100)
  label: string;

  @Required()
  @AllowEmpty()
  @Description("Activity or Dresscode in HTML format")
  @MinLength(3)
  @MaxLength(500)
  description: string = "";

  @Required()
  @Name("created_at")
  @Format("date-time")
  @Groups("!update", "!create")
  createdAt: Date = new Date();

  @Required()
  @Name("updated_at")
  @Format("date-time")
  @Groups("!update", "!create")
  updatedAt: Date = new Date();
}
