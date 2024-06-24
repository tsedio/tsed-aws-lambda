import { BaseDocument } from "@project/domain/document/BaseDocument.js"

export interface Repository<Model extends BaseDocument> {
  getById(id: string): Promise<Model | null>
  getAll(queryOpts?: Partial<{ limit: number }>): Promise<Model[]>
  create(timeslot: Model): Promise<Model>
  save(timeslot: Model): Promise<Model>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}
