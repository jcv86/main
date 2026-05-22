import type { Metadata } from "next"
import GamificationClient from "./gamification-client"

export const metadata: Metadata = {
  title: "Gamificación - DTC",
  description: "Sistema de logros, misiones y progreso gamificado",
}

export default function GamificationPage() {
  return <GamificationClient />
}
