import PromptManagementDashboard from "@/components/prompt-management-dashboard"

export default function PromptManagementPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Prompts</h1>
        <p className="text-muted-foreground">Administra y mejora los prompts de Sofia y Dani mediante A/B testing</p>
      </div>

      <PromptManagementDashboard />
    </div>
  )
}
