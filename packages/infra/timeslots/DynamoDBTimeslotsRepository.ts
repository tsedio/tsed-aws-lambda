import { Timeslot } from "@project/domain/timeslots/Timeslot.js"
import { Constant, Injectable } from "@tsed/di"

import { DynamoDBRepository } from "../aws/dynamodb/DynamoDBRepository.js"

@Injectable()
export class DynamoDBTimeslotsRepository extends DynamoDBRepository<Timeslot> {
  @Constant("envs.DYNAMODB_TIMESLOTS_TABLE")
  protected declare tableName: string
  protected model = Timeslot
}
