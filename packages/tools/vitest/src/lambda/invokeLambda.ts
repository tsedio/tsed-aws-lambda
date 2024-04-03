import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda"

export async function invokeLambda(funcName: string, payload: unknown = {}) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  const client = new LambdaClient({
    endpoint: "https://localhost:4566",
    region: "eu-west-3",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test"
    }
  })

  const command = new InvokeCommand({
    FunctionName: funcName,
    Payload: JSON.stringify(payload),
    LogType: LogType.Tail
  })

  const { Payload, LogResult } = await client.send(command)
  const result = Payload ? JSON.parse(Buffer.from(Payload).toString()) : ""
  const logs = LogResult ? Buffer.from(LogResult, "base64").toString() : ""

  return {
    logs,
    result,
    data: result?.headers["content-type"] === "application/json" && result.body ? JSON.parse(result.body) : null,
    statusCode: 200,
    headers: result.headers
  }
}
