import type { Metadata } from "next"
import BibliotecaClient from "./biblioteca-client"

export const metadata: Metadata = {
  title: "Biblioteca de Desarrollo Profesional | Despega Tu Carrera",
  description: "Área de recursos de Despega Tu Carrera.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function BibliotecaPage() {
  return <BibliotecaClient />
}
