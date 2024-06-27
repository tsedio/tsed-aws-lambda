import { dirname } from "node:path"

import { Timeslot } from "@project/domain/timeslots/Timeslot.js" // use absolute import to optimize the bundle tree shaking
import { Constant, Inject, Injectable } from "@tsed/di"
import { deserialize, serialize } from "@tsed/json-mapper"
import { Logger } from "@tsed/logger"
import fs from "fs-extra"
import { v4 } from "uuid"

import { Repository } from "../interfaces/Repository.js"

@Injectable()
export class FsTimeslotsRepository implements Repository<Timeslot> {
  @Constant("timeslots.dbFilePath", "")
  private timeslotsFilePath: string

  private cache = new Map<string, Timeslot>()

  @Inject()
  private logger: Logger

  async $onInit() {
    if (this.timeslotsFilePath) {
      if (!fs.existsSync(this.timeslotsFilePath)) {
        this.logger.info({
          event: "TIMESLOTS_REPOSITORY",
          message: "Timeslots database file not found. Creating a new one...",
          filePath: this.timeslotsFilePath
        })
        await fs.ensureDir(dirname(this.timeslotsFilePath))
        await fs.writeJson(this.timeslotsFilePath, [])
      }

      const raw = await fs.readJson(this.timeslotsFilePath, {
        encoding: "utf-8"
      })

      for (const timeslot of raw) {
        this.cache.set(timeslot.id, deserialize(timeslot, { type: Timeslot }))
      }
    }
  }

  getById(id: string) {
    return Promise.resolve(this.cache.get(id) || null)
  }

  getAll(queryOpts?: Partial<{ limit: number }>) {
    const timeslots = [...this.cache.values()]

    if (queryOpts?.limit) {
      return Promise.resolve(timeslots.slice(0, queryOpts.limit))
    }

    return Promise.resolve(timeslots)
  }

  async create(timeslot: Timeslot) {
    timeslot.id = v4()
    timeslot.createdAt = new Date()
    timeslot.updatedAt = new Date()

    this.cache.set(timeslot.id, timeslot)
    await this.saveToDisk()

    return timeslot
  }

  async save(timeslot: Timeslot) {
    timeslot.updatedAt = new Date()

    this.cache.set(timeslot.id, timeslot)
    await this.saveToDisk()

    return timeslot
  }

  async delete(id: string): Promise<void> {
    this.cache.delete(id)
    await this.saveToDisk()
  }

  clear() {
    this.cache.clear()
    return this.saveToDisk()
  }

  protected async saveToDisk() {
    if (this.timeslotsFilePath) {
      await fs.writeJson(this.timeslotsFilePath, serialize([...this.cache.values()]), {
        spaces: 2,
        EOL: "\n"
      })
    }
  }
}
