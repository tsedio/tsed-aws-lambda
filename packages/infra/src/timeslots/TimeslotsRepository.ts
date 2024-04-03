import { Timeslot } from "@project/domain/timeslots/Timeslot.js" // use absolute import to optimize the bundle tree shaking
import { Injectable } from "@tsed/di"
import { v4 } from "uuid"

@Injectable()
export class TimeslotsRepository {
  private cache = new Map<string, Timeslot>()

  getById(id: string) {
    return Promise.resolve(this.cache.get(id))
  }

  getAll() {
    return Promise.resolve(Array.from(this.cache.values()))
  }

  create(timeslot: Timeslot) {
    timeslot.id = v4()
    timeslot.createdAt = new Date()
    timeslot.updatedAt = new Date()

    this.cache.set(timeslot.id, timeslot)

    return Promise.resolve(timeslot)
  }

  save(timeslot: Timeslot) {
    timeslot.updatedAt = new Date()

    this.cache.set(timeslot.id, timeslot)

    return Promise.resolve(timeslot)
  }
}
