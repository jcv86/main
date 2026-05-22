"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CompetencyData {
  name: string
  value: number
  fullMark: number
}

interface CompetencyRadarChartProps {
  data: CompetencyData[]
  title?: string
  description?: string
  height?: number
  strokeColor?: string
  fillColor?: string
}

export function CompetencyRadarChart({
  data,
  title = "Análisis de Competencias",
  description = "Tu perfil de competencias visualizado",
  height = 400,
  strokeColor = "#8b5cf6",
  fillColor = "#8b5cf6",
}: CompetencyRadarChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <PolarGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="name"
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              orientation="outer"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />
            <Radar
              name="Puntuación"
              dataKey="value"
              stroke={strokeColor}
              fill={fillColor}
              fillOpacity={0.6}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
