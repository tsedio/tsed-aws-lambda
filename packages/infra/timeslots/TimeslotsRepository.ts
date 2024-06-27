import { Timeslot } from "@project/domain/timeslots/Timeslot.js"

import { Repository } from "../interfaces/Repository.js"

export interface TimeslotsRepository extends Repository<Timeslot> {}
export const TimeslotsRepository = Symbol.for("TimeslotsRepository")
