import { redirect } from 'next/navigation'

/** Preserve old bookmarks while using the current, authenticated journey. */
export default function LegacyA2CaminoPage() {
  redirect('/despega/a2-routes')
}
