"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users } from "lucide-react"

const chartData = [
  { day: "Mon", visits: 8 },
  { day: "Tue", visits: 10 },
  { day: "Wed", visits: 12 },
  { day: "Thu", visits: 6 },
  { day: "Fri", visits: 9 },
  { day: "Sat", visits: 4 },
]

const chartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
}

export function ChartDailyVisits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" />Patient Visits This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[270px]">
          <BarChart data={chartData} layout="vertical" margin={{ left: -10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="day" type="category" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="visits" fill="var(--chart-1)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Daily patient visit trends</CardFooter>
    </Card>
  )
}
