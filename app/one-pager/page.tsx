import type { Metadata } from "next"
import OnePagerClient from "./one-pager-client"

export const metadata: Metadata = {
  title: "One-Page Summary - Despega Tu Carrera",
  description: "Comprehensive one-page summary of the Despega Tu Carrera platform and value proposition",
  robots: {
    index: false,
    follow: false,
  },
}

export default function OnePager() {
  return <OnePagerClient />
}
