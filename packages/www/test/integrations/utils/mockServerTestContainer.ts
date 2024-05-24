import { join } from "path"
import { GenericContainer, StartedDockerComposeEnvironment, Wait } from "testcontainers"
import { StartedGenericContainer } from "testcontainers/build/generic-container/started-generic-container.js"

const ROOT_DIR = join(import.meta.dirname, "../../../../..")

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      TEST_CONTAINER_MOCKSERVER: StartedDockerComposeEnvironment | null
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global["TEST_CONTAINER_MOCKSERVER"] = null

function getEnvironment<T>(key: string): T | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return global[key]
}

function setEnvironment(key: string, environment: unknown) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global[key] = environment
}

function createMockContainer() {
  return new GenericContainer("mockserver/mockserver:mockserver-5.15.0")
    .withExposedPorts(1080)

    .withEnvironment({
      MOCKSERVER_WATCH_INITIALIZATION_JSON: "true",
      MOCKSERVER_INITIALIZATION_JSON_PATH: "/config/**/*.json",
      LOG_LEVEL_DEBUG: "true"
    })
    .withBindMounts([
      {
        source: join(ROOT_DIR, "./mockserver"),
        target: "/config"
      }
    ])
    .withWaitStrategy(Wait.forLogMessage("started on port: 1080", 1))
    .start()
}

export async function startMockServer() {
  // await stopMockServer()
  const container = getEnvironment<StartedGenericContainer>("TEST_CONTAINER_MOCKSERVER") || (await createMockContainer())

  setEnvironment("TEST_CONTAINER_MOCKSERVER", container)

  process.env.MOCKSERVER_URL = "http://" + container.getHost() + ":" + container.getFirstMappedPort()

  return {
    container,
    url: process.env.MOCKSERVER_URL
  }
}

export async function stopMockServer() {
  const container = getEnvironment<StartedGenericContainer>("TEST_CONTAINERS_MOCKSERVER")

  if (container) {
    await container.stop()
  }
}

export function getMockServerUrl() {
  return process.env.MOCKSERVER_URL
}
