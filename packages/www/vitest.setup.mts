import { startMockServer, stopMockServer } from "./test/integrations/utils/mockServerTestContainer.js";

export async function setup() {
  await startMockServer();
}
export async function teardown() {
  await stopMockServer();
}
