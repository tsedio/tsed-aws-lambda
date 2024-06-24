import "./DynamoDBDocClient.js"

import { DeleteItemCommand, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { BaseDocument } from "@project/domain/document/BaseDocument.js"
import { isArray, Type } from "@tsed/core"
import { DIContext, Inject, InjectContext } from "@tsed/di"
import { deserialize, serialize } from "@tsed/json-mapper"
import { v4 } from "uuid"

import { Repository } from "../../interfaces/Repository.js"

export abstract class DynamoDBRepository<Model extends BaseDocument> implements Repository<Model> {
  protected model: Type<Model>
  protected tableName: string

  @Inject(DynamoDBDocumentClient)
  protected doc: DynamoDBDocumentClient

  @InjectContext()
  protected $ctx: DIContext

  clear(): Promise<void> {
    return Promise.resolve(undefined)
  }

  async getById(id: string): Promise<Model | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({ id })
    })

    const response = await this.doc.send(command)

    if (!response.Item) {
      return null
    }

    return this.deserialize(unmarshall(response.Item))
  }

  async getAll(opts?: Partial<{ limit: number }>): Promise<Model[]> {
    try {
      const result = await this.doc.send(
        new ScanCommand({
          TableName: this.tableName,
          Limit: opts?.limit
        })
      )

      return this.deserialize((result.Items || []).map((item) => unmarshall(item)))
    } catch (er) {
      this.$ctx.logger.error({
        event: "DYNAMODB_QUERY_ERROR",
        error: er,
        options: opts,
        table_name: this.tableName
      })
      throw er
    }
  }

  async create(document: Model): Promise<Model> {
    document.id = v4()

    await this.doc.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(this.serialize(document))
      })
    )

    return document
  }

  async save(document: Model): Promise<Model> {
    const params = {
      TableName: this.tableName,
      Item: marshall(this.serialize(document))
    }

    document.updatedAt = new Date()

    await this.doc.send(new PutItemCommand(params))

    return document
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id })
    }

    await this.doc.send(new DeleteItemCommand(params))
  }

  protected deserialize<Data>(data: Record<string, unknown> | Record<string, unknown>[]): Data {
    return deserialize<Data>(data, {
      type: this.model,
      useAlias: true
    })
  }

  protected serialize<Data>(data: Data | Data[]): Record<string, unknown> | Record<string, unknown>[] {
    return serialize(data, {
      type: this.model,
      collectionType: isArray(data) ? Array : undefined,
      useAlias: true
    })
  }
}
