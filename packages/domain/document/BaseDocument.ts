import { Format, Groups, JsonFormatTypes, Name, Required, RequiredGroups } from "@tsed/schema"

export class BaseDocument {
  @Format(JsonFormatTypes.UUID)
  @Required()
  @RequiredGroups("update")
  id: string

  @Required()
  @Name("created_at")
  @Format("date-time")
  @Groups("!update", "!create")
  createdAt: Date = new Date()

  @Required()
  @Name("updated_at")
  @Format("date-time")
  @Groups("!update", "!create")
  updatedAt: Date = new Date()
}
