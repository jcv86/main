import type { Metadata } from "next"
import NoticiasClient from "./noticias-client"

export const metadata: Metadata = {
  title: "Noticias Personalizadas | DTC",
  description:
    "Feed de contenido personalizado sobre trabajo, psicología, bienestar, relaciones, hábitos, dinero y propósito",
}

export default function NoticiasPage() {
  return <NoticiasClient />
}
