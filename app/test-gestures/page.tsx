import { redirect } from 'next/navigation'

/**
 * Legacy browser-only gesture sandbox. The public route stays compatible but
 * no longer participates in production prerendering.
 */
export default function TestGesturesPage() {
  redirect('/despega/a3')
}
