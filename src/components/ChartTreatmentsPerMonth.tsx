"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Stethoscope } from "lucide-react"

const chartData = [
  { month: "Jan", treatments: 22 },
  { month: "Feb", treatments: 18 },
  { month: "Mar", treatments: 30 },
  { month: "Apr", treatments: 25 },
  { month: "May", treatments: 35 },
  { month: "Jun", treatments: 28 },
]

const chartConfig = {
  treatments: { label: "Treatments", color: "var(--chart-1)" },
}

export function ChartTreatmentsPerMonth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Stethoscope className="h-4 w-4" />Treatments Per Month</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[260px]">
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="treatments" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Tracking treatments performed each month</CardFooter>
    </Card>
  )
}
