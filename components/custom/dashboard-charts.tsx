"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Label,
  Pie,
  PieChart,
  Line,
  LineChart,
} from "recharts";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Task } from "@/app/task-list/page";

// Define the type for aggregated data
interface AggregatedData {
  [key: string]: {
    high: number;
    medium: number;
    low: number;
  };
}

// Define the type for chart data
interface ChartData {
  day: string;
  high: number;
  medium: number;
  low: number;
}

// Define the type for pie chart data
interface PieChartData {
  name: string;
  value: number;
}

const chartConfig: ChartConfig = {
  high: {
    label: "High",
    color: "hsl(var(--chart-1))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-5))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-6))",
  },
};

const lineChartConfig: ChartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-3))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
};

const getStartAndEndOfWeek = (): { startOfWeek: Date; endOfWeek: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startOfWeek = new Date(now.setDate(now.getDate() - dayOfWeek)); // Sunday
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6)); // Saturday
  return { startOfWeek, endOfWeek };
};

const aggregateTasksForCurrentWeek = (tasks: Task[]): AggregatedData => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();

  const result: AggregatedData = {
    Monday: { high: 0, medium: 0, low: 0 },
    Tuesday: { high: 0, medium: 0, low: 0 },
    Wednesday: { high: 0, medium: 0, low: 0 },
    Thursday: { high: 0, medium: 0, low: 0 },
    Friday: { high: 0, medium: 0, low: 0 },
    Saturday: { high: 0, medium: 0, low: 0 },
    Sunday: { high: 0, medium: 0, low: 0 },
  };

  tasks.forEach((task) => {
    if (task.completed) {
      const dueDate = new Date(task.dueDate);
      if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
        const day = dueDate.toLocaleString("en-US", { weekday: "long" });
        if (result[day]) {
          if (task.priority === "High") {
            result[day].high += 1;
          } else if (task.priority === "Medium") {
            result[day].medium += 1;
          } else if (task.priority === "Low") {
            result[day].low += 1;
          }
        }
      }
    }
  });

  return result;
};

const aggregateRemainingTasksForCurrentWeek = (
  tasks: Task[]
): { [key: string]: number } => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();

  const result: { [key: string]: number } = {
    High: 0,
    Medium: 0,
    Low: 0,
  };

  tasks.forEach((task) => {
    if (!task.completed) {
      const dueDate = new Date(task.dueDate);
      if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
        if (task.priority === "High") {
          result.High += 1;
        } else if (task.priority === "Medium") {
          result.Medium += 1;
        } else if (task.priority === "Low") {
          result.Low += 1;
        }
      }
    }
  });

  return result;
};

const aggregateTasksForLineChart = (tasks: Task[]) => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();

  const result: { [day: string]: { completed: number; remaining: number } } = {
    Monday: { completed: 0, remaining: 0 },
    Tuesday: { completed: 0, remaining: 0 },
    Wednesday: { completed: 0, remaining: 0 },
    Thursday: { completed: 0, remaining: 0 },
    Friday: { completed: 0, remaining: 0 },
    Saturday: { completed: 0, remaining: 0 },
    Sunday: { completed: 0, remaining: 0 },
  };

  tasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    if (dueDate >= startOfWeek && dueDate <= endOfWeek) {
      const day = dueDate.toLocaleString("en-US", { weekday: "long" });
      if (task.completed) {
        result[day].completed += 1;
      } else {
        result[day].remaining += 1;
      }
    }
  });

  return result;
};

function DashBarChart() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Aggregate tasks by the current week
  const aggregatedData = aggregateTasksForCurrentWeek(tasks);

  // Prepare the chart data
  const chartData: ChartData[] = Object.keys(aggregatedData).map((day) => ({
    day,
    high: aggregatedData[day].high,
    medium: aggregatedData[day].medium,
    low: aggregatedData[day].low,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion by Priority</CardTitle>
        <CardDescription>
          Showing task completion for the current week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[250px] w-full p-0"
        >
          <BarChart width={500} height={250} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="high" fill="hsl(var(--chart-1))" radius={4} />
            <Bar dataKey="medium" fill="hsl(var(--chart-5))" radius={4} />
            <Bar dataKey="low" fill="hsl(var(--chart-6))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function DashPieChart() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Aggregate remaining tasks by priority for the current week
  const remainingTasks = aggregateRemainingTasksForCurrentWeek(tasks);

  // Prepare the chart data
  const pieChartData: PieChartData[] = [
    { name: "High", value: remainingTasks.High },
    { name: "Medium", value: remainingTasks.Medium },
    { name: "Low", value: remainingTasks.Low },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Remaining Tasks by Priority for This Week</CardTitle>
        <CardDescription>
          Number of remaining tasks by priority level
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[275px] p-0"
        >
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              strokeWidth={2}
              stroke="#fff"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--chart-${index + 1}))`}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const totalTasks = pieChartData.reduce(
                      (acc, curr) => acc + curr.value,
                      0
                    );
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function DashLineChart() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // Aggregate tasks for the line chart
  const aggregatedData = aggregateTasksForLineChart(tasks);

  // Prepare the chart data
  const chartData = Object.keys(aggregatedData).map((day) => ({
    day,
    completed: aggregatedData[day].completed,
    remaining: aggregatedData[day].remaining,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Progress Over the Week</CardTitle>
        <CardDescription>
          Showing completed and remaining tasks for the current week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={lineChartConfig}
          className="mx-auto max-h-[250px] p-0"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              dataKey="completed"
              type="monotone"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="remaining"
              type="monotone"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { DashBarChart, DashPieChart, DashLineChart };
