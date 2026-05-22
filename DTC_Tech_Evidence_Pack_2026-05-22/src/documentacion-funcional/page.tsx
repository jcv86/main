import { DocumentationViewer } from "@/components/documentation-viewer"

export const metadata = {
  title: "Documentación Funcional - DTC",
  description: "Guía completa no técnica de DespegarTuCarrera para usuarios, administradores y stakeholders",
}

export default function DocumentacionFuncionalPage() {
  return <DocumentationViewer type="funcional" />
}
