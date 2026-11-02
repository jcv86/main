import { redirect } from 'next/navigation'

/** The legacy route scores are retired; do not reinterpret stored A1 results. */
export default function LegacyA2RecommendationsPage() {
  redirect('/despega/a2-routes')
}
