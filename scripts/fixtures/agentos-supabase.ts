/** Test-only dependency injection. No production import or network fallback. */
let client: unknown
export function setAgentosTestClient(value: unknown) { client = value }
export async function createClient(): Promise<any> {
  if (!client) throw new Error('AGENTOS_TEST_CLIENT_NOT_SET')
  return client
}
