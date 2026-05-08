import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Progress Dashboard Test",
}

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="bg-black" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
