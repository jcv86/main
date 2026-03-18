import { CoachProviderWrapper } from '@/components/coach-provider-wrapper'

export default function A4Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CoachProviderWrapper>
      <div className="min-h-screen">
        {children}
      </div>
    </CoachProviderWrapper>
  )
}
