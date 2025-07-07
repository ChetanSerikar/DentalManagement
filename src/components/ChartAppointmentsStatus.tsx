
import { Pie, PieChart } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity } from "lucide-react"

const chartData = [
  { status: "Completed", count: 24, fill: "var(--chart-1)" },
  { status: "Pending", count: 12, fill: "var(--chart-2)" },
  { status: "Cancelled", count: 6, fill: "var(--chart-3)" },
  { status: "Rescheduled", count: 8, fill: "var(--chart-4)" },
]

const chartConfig = {
  count: { label: "Appointments" },
  Completed: { label: "Completed", color: "var(--chart-1)" },
  Pending: { label: "Pending", color: "var(--chart-2)" },
  Cancelled: { label: "Cancelled", color: "var(--chart-3)" },
  Rescheduled: { label: "Rescheduled", color: "var(--chart-4)" },
}

export function ChartAppointmentsStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" />Appointments by Status</CardTitle>
        <CardDescription>Past 30 Days</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="w-full max-h-[260px]">
          <PieChart > 
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="count" nameKey="status" outerRadius={120} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">Visual breakdown of appointment statuses</CardFooter>
    </Card>
  )
}
