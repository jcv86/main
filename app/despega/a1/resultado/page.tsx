import { redirect } from 'next/navigation'

/** Legacy result route kept for old bookmarks and redirects. */
export default function LegacyA1ResultPage() {
  redirect('/despega/a1-report')
}
