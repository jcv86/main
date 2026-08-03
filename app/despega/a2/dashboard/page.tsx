import { redirect } from 'next/navigation'

/**
 * Legacy A2 dashboard kept for bookmarks and old callbacks.
 * The canonical, persistent route experience lives at /despega/a2.
 */
export default function LegacyA2DashboardPage() {
  redirect('/despega/a2')
}
