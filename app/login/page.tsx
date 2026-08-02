import { redirect } from 'next/navigation'
import { SIGN_IN_PATH } from '@/lib/auth/routes'

export default function LegacyLoginPage() {
  redirect(SIGN_IN_PATH)
}
