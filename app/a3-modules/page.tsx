import { redirect } from 'next/navigation'

/**
 * Legacy Pillar 3 hub.
 *
 * DTC now has one canonical A3 experience and one progress/reward system under
 * `/despega/a3`. Keeping the old client-side hub active would show a second,
 * inconsistent source of progress and XP.
 */
export default function LegacyA3ModulesHub() {
  redirect('/despega/a3')
}
