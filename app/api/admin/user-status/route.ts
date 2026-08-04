import { adminUnavailableResponse } from '@/lib/admin/unconfigured'

export async function PUT() {
  return adminUnavailableResponse()
}
