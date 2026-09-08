/** Test-only port. Never imported by application code. */
let client: unknown
export function setJourneyTestClient(value: unknown) { client = value }
export async function createClient(): Promise<any> { if (!client) throw new Error('JOURNEY_TEST_CLIENT_NOT_SET'); return client }
export function createAdminClient(): any { if (!client) throw new Error('JOURNEY_TEST_CLIENT_NOT_SET'); return client }
