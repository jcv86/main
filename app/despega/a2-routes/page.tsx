import { redirect } from 'next/navigation'

/**
 * Legacy A2 route kept only for old bookmarks and day-page callbacks.
 */
export default function LegacyA2RoutesPage() {
  redirect('/despega/a2')
}
