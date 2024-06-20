import parse from "url-parse"

import { HttpRequestConfig, HttpRequestErrorConfig } from "../HttpClientOptions.js"

export function logToCurl(opts: HttpRequestConfig | HttpRequestErrorConfig) {
  const { params, method, data } = opts
  const url = `${opts.response?.config?.baseURL || ""}${opts.url}`
  const headers = {
    ...(opts.response?.config?.headers || {}),
    ...(opts.headers || {})
  }

  const request = parse(url, true)

  if (params) {
    request.set("query", params)
  }

  let curl = `curl -X ${(method || "POST").toUpperCase()} '${request.toString()}'`

  if (data) {
    curl += ` -d '${JSON.stringify(data)}'`
  }

  curl += Object.entries(headers).reduce((curlHeaders, [key, value]) => `${curlHeaders} -H '${key}: ${value}'`, "")

  return curl
}
