import { SwaggerOS3Settings } from "@tsed/swagger"

export const swaggerConfig = [
  {
    path: "/doc",
    specVersion: "3.1.0",
    spec: {
      components: {
        securitySchemes: {
          BearerJWT: {
            type: "http",
            scheme: "bearer",
            description: "Use a valid JWT token to access the endpoints with appropriate scope."
          }
        }
      }
    }
  } as SwaggerOS3Settings
]
