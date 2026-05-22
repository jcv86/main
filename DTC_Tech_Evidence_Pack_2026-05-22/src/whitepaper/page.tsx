import type { Metadata } from "next"
import { WhitepaperClient } from "./whitepaper-client"

export const metadata: Metadata = {
  title: "Technical Whitepaper - Despega Tu Carrera Platform",
  description:
    "Complete technical documentation of the DTC platform architecture, features, and implementation by Travis Comber, funded by Joaquin Covarrubias",
}

export default function WhitepaperPage() {
  return <WhitepaperClient />
}
