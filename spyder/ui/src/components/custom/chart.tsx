"use client"

import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { VehicleData } from "@/app/page"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Chart({data}: {data: VehicleData[]}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Battery Temperature History</CardTitle>
        <CardDescription>Temperature history for the last 10 recieved entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={true}
              axisLine={true}
              tickMargin={5}
              tickFormatter={(value) => new Date(value).toLocaleTimeString("en-AU")}
            />
            <YAxis
              unit={"°C"}
              tickLine={true}
              axisLine={true}
              tickMargin={5}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelKey="battery_temperature" nameKey="battery_temperature" />}
            />
            <Line
              dataKey="battery_temperature"
              name="Temperature"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={true}
              unit={"°C"}
              isAnimationActive={false}
            />
            {/* Unsafe */}
            <ReferenceArea
            y1={80}
            fill="red"
            />
            <ReferenceArea
            y1={0}
            y2={20}
            fill="red"
            />

            {/* Warn */}
            <ReferenceArea
            y1={20}
            y2={25}
            fill="orange"
            />
            <ReferenceArea
            y1={75}
            y2={80}
            fill="orange"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
