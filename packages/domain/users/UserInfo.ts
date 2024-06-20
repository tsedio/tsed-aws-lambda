import { ArrayOf, CollectionOf, Default, Email, Example, Groups, Name, Property, Required } from "@tsed/schema"

export class UserInfo {
  @Required()
  @Name("id")
  @Groups("!create", "!update", "!partial")
  _id: string

  @Required()
  @Email()
  email: string

  @Required()
  @Property()
  @Default(false)
  @Groups("!link")
  emailVerified: boolean = false

  @Required()
  @ArrayOf(String)
  @CollectionOf(String)
  @Example(["openid", "profile"])
  scopes: string[] = []

  @Required()
  @Property()
  @Example("Sparrow")
  lastname: string

  @Required()
  @Property()
  @Example("Jack")
  firstname: string

  constructor(data: Partial<UserInfo> = {}) {
    Object.assign(this, data)
  }
}
