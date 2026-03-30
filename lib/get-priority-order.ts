type DimKey = "plan_ejecutivo" | "energia" | "enfoque" | "relaciones"

const labels: Record<DimKey, string> = {
  plan_ejecutivo: "Plan Ejecutivo",
  energia: "Energía",
  enfoque: "Enfoque",
  relaciones: "Relaciones",
}

export function getPriorityOrder(scores: Record<DimKey, number>) {
  return (Object.keys(scores) as DimKey[])
    .sort((a, b) => {
      const diff = scores[a] - scores[b] // menor score = más fricción = prioridad más alta
      if (diff !== 0) return diff
      return labels[a].localeCompare(labels[b]) // desempate alfabético
    })
    .map((k, idx) => ({ key: k, label: labels[k], score: scores[k], priority: idx + 1 }))
}

export function getPriorityOrderByScore(scores: Record<DimKey, number>): DimKey[] {
  return (Object.keys(scores) as DimKey[])
    .sort((a, b) => {
      const diff = scores[a] - scores[b]
      if (diff !== 0) return diff
      return labels[a].localeCompare(labels[b])
    })
}
