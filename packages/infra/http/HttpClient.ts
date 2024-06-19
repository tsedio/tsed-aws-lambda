import { Injectable } from "@tsed/di"
import { Exception } from "@tsed/exceptions"
import { deserialize, serialize } from "@tsed/json-mapper"
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  Method,
  RawAxiosRequestHeaders
} from "axios"
import omit from "lodash/omit.js"

import { HttpClientOptions } from "./HttpClientOptions.js"
import { HttpLogClient } from "./HttpLogClient.js"
import { getParamsSerializer } from "./utils/getParamsSerializer.js"
import { interpolate } from "./utils/interpolate.js"

@Injectable()
export class HttpClient<Options extends HttpClientOptions = HttpClientOptions> extends HttpLogClient {
  #raw: AxiosInstance

  protected baseURL: string

  $onInit() {
    this.#raw = this.create()
  }

  get raw() {
    return this.#raw
  }

  async head(endpoint: string, options?: Options): Promise<RawAxiosRequestHeaders | AxiosHeaders> {
    const reqOptions = await this.getOptions("HEAD", endpoint, options)
    const { headers } = await this.raw(reqOptions)

    return headers
  }

  async get<Data = unknown>(endpoint: string, options?: Options): Promise<Data> {
    const reqOptions = await this.getOptions("GET", endpoint, options)
    const result = await this.send(reqOptions)

    return this.mapResponse(result, options)
  }

  async post<Data = unknown>(endpoint: string, options?: Options): Promise<Data> {
    const reqOptions = await this.getOptions("POST", endpoint, options)
    const result = await this.send(reqOptions)

    return this.mapResponse(result, options)
  }

  async put<Data = unknown>(endpoint: string, options?: Options): Promise<Data> {
    const reqOptions = await this.getOptions("PUT", endpoint, options)
    const result = await this.send(reqOptions)

    return this.mapResponse(result, options)
  }

  async patch<Data = unknown>(endpoint: string, options?: Options): Promise<Data> {
    const reqOptions = await this.getOptions("PATCH", endpoint, options)
    const result = await this.send(reqOptions)

    return this.mapResponse(result, options)
  }

  async delete<Data = unknown>(endpoint: string, options?: Options): Promise<Data> {
    const reqOptions = await this.getOptions("DELETE", endpoint, options)
    const result = await this.send(reqOptions)

    return this.mapResponse(result, options)
  }

  /**
   * Allow Child class to customize axios instance if needed
   */
  protected create(opts?: CreateAxiosDefaults) {
    return axios.create({
      ...opts,
      baseURL: this.baseURL,
      paramsSerializer: getParamsSerializer,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...opts?.headers
      }
    })
  }

  protected async send(options: AxiosRequestConfig) {
    const startTime = new Date().getTime()

    try {
      const response = await this.raw(options)

      this.onSuccess({ ...options, startTime, response })

      return response
    } catch (error: unknown) {
      this.onError({
        ...options,
        startTime,
        error: error as AxiosError,
        response: (error as AxiosError).response
      })
      this.throwException(error as AxiosError)
    }
  }

  /**
   * Convert an error to a Ts.ED Exception instance.
   * Depending on the called backed, this method must be adapted to extract error message or other information.
   * @param error
   * @protected
   */
  protected throwException(error: AxiosError) {
    const { status, headers, data, statusText } = error?.response || {}

    const exception = new Exception(
      status || 500,
      (data as { message?: string })?.message || statusText || "Internal Server Error",
      error.response?.data
    )

    if (headers) {
      exception.headers = headers
    }

    exception.errors = [data || error]

    Error.captureStackTrace(exception)

    throw exception
  }

  protected async getOptions(method: Method, endpoint: string, options: Options = {} as Options): Promise<AxiosRequestConfig> {
    const opts: Options = options || ({} as Options)
    const data = serialize(opts.data, { groups: opts.groups })

    endpoint = interpolate(endpoint, options.pathParams)

    return {
      method,
      url: endpoint,
      ...omit(opts, ["env", "type", "collectionType", "additionalProperties", "groups"]),
      params: serialize(opts.params, { groups: opts.groups }),
      data
    }
  }

  /**
   * Map the response depending on the given request options
   */
  protected mapResponse(result?: AxiosResponse, options?: HttpClientOptions) {
    const { type, withHeaders } = options || {}

    if (options?.responseType === "stream") {
      return result
    }

    const data = type ? this.deserialize(result?.data, options) : result?.data

    return withHeaders ? { data, headers: result?.headers } : data
  }

  protected deserialize(data: unknown, options?: HttpClientOptions) {
    const { type, collectionType, additionalProperties = false, useAlias = true, groups } = options || {}

    return deserialize(data, {
      collectionType,
      type,
      useAlias,
      additionalProperties,
      groups
    })
  }
}
