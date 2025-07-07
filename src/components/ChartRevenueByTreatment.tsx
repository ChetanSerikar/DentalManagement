"use client"

import { Pie, PieChart } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Banknote } from "lucide-react"

const chartData = [
  { type: "Filling", value: 1200, fill: "var(--chart-1)" },
  { type: "Cleaning", value: 800, fill: "var(--chart-2)" },
  { type: "Whitening", value: 600, fill: "var(--chart-3)" },
  { type: "Root Canal", value: 1000, fill: "var(--chart-4)" },
]

const chartConfig = {
  value: { label: "Revenue" },
  Filling: { label: "Filling", color: "var(--chart-1)" },
  Cleaning: { label: "Cleaning", color: "var(--chart-2)" },
  Whitening: { label: "Whitening", color: "var(--chart-3)" },
  "Root Canal": { label: "Root Canal", color: "var(--chart-4)" },
}

export function ChartRevenueByTreatment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Banknote className="h-4 w-4" />Revenue by Treatment</CardTitle>
        <CardDescription>YTD Revenue Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="w-full max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="value" nameKey="type" outerRadius={120} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Distribution of income by treatment type</CardFooter>
    </Card>
  )
}
