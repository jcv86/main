'use client'

import { CIPCapacityWidget } from '@/components/cip-capacity-widget'

export function CIPCapacityWidgetWrapper({ userId }: { userId: string }) {
  return <CIPCapacityWidget userId={userId} />
}
