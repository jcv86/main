// Skip env validation for test routes
if (typeof process !== 'undefined') {
  process.env.SKIP_ENV_VALIDATION = 'true'
}

export const metadata = {
  title: 'Progress Dashboard Test',
}

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
