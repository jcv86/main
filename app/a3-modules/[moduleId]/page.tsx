import { redirect } from 'next/navigation'

/**
 * Legacy module player.
 *
 * Individual legacy modules used a parallel client-side XP implementation that
 * could not reliably persist. Route every old bookmark to the canonical A3
 * dashboard, where access and progression are resolved server-side.
 */
export default function LegacyA3ModulePage() {
  redirect('/despega/a3')
}
