import { DIContext, Inject, InjectContext, Opts } from "@tsed/di"
import { Constant } from "@tsed/di"
import { $log, Logger } from "@tsed/logger"
import { stringify } from "querystring"

import { HttpRequestConfig, HttpRequestErrorConfig } from "./HttpClientOptions.js"
import { logToCurl } from "./utils/logToCurl.js"

export interface HttpClientCtorOptions {
  callee: string
}

const jsonStringify = (display: boolean, body: object) => (body && display ? JSON.stringify(body) : "")

export class HttpLogClient {
  callee: string

  @InjectContext()
  $ctx?: DIContext

  @Constant("logger.httpLevel")
  protected level: string

  constructor(@Opts options: Partial<HttpClientCtorOptions> = {}) {
    this.callee = options.callee || "http"
  }

  @Inject()
  protected _logger: Logger

  get logger(): Logger {
    return (this.$ctx?.logger || this._logger || $log) as unknown as Logger
  }

  protected onSuccess(options: HttpRequestConfig) {
    return this.logger.info({
      ...this.formatLog(options, false),
      state: "OK"
    })
  }

  protected onError(options: HttpRequestErrorConfig) {
    this.logger.warn({
      ...this.formatLog(options, true),
      state: "KO",
      callee_error: options.error.message
    })
  }

  /**
   * Customize logs format here before sending to logger
   * @param options
   * @param verbose
   * @protected
   */
  protected formatLog(options: HttpRequestConfig | HttpRequestErrorConfig, verbose: boolean) {
    const { startTime, url, method } = options
    const { callee } = this
    const full = this.level === "debug" || verbose
    const { status, headers, data } = options.response || {}

    return {
      callee,
      url,
      method,
      callee_request_qs: options.params ? stringify(options.params) : "",
      callee_request_headers: options.headers ? jsonStringify(full, options.headers) : "",
      callee_request_body: options.data ? jsonStringify(full, options.data) : undefined,
      callee_response_code: status,
      callee_response_headers: headers && jsonStringify(full, headers),
      callee_response_body: full && data != undefined ? jsonStringify(full, data) : undefined,
      request_id: this.$ctx?.id,
      duration: new Date().getTime() - startTime,
      curl: full ? logToCurl(options) : undefined
    }
  }
}
