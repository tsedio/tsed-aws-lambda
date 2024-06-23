import "@tsed/platform-express" // /!\ keep this import
import "@tsed/ajv"
import "@tsed/swagger"

import * as controllers from "@project/controllers/index.js"
import { HttpClient } from "@project/infra/http/HttpClient.js"
import { Configuration, Inject } from "@tsed/di"
import { join } from "path"

import { config } from "./config/index.js"
import * as pages from "./controllers/pages/index.js"

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/": [...Object.values(controllers)],
    "/pages": [...Object.values(pages)]
  },

  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true } }
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: ["**/*.spec.ts"]
})
export class Server {
  @Inject()
  client: HttpClient
}
