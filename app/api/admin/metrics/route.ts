import { adminUnavailableResponse } from '@/lib/admin/unconfigured'

export async function GET() {
  return adminUnavailableResponse()
}
