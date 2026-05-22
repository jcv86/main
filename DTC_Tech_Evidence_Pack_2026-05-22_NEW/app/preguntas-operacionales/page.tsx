import type { Metadata } from "next"
import { DocumentationViewer } from "@/components/documentation-viewer"

export const metadata: Metadata = {
  title: "Preguntas Operacionales - DTC",
  description: "Preguntas operacionales y técnicas pendientes de respuesta para Juan",
}

export default function PreguntasOperacionalesPage() {
  return <DocumentationViewer type="operacional" />
}
