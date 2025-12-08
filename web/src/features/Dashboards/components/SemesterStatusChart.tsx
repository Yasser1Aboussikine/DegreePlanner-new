import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { Calendar } from "lucide-react";
import CardLayout from "@/shared/CardLayout";

interface StatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface SemesterStatusChartProps {
  statusData: StatusData[];
}

const defaultChartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-3))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-2))",
  },
};

export function SemesterStatusChart({ statusData }: SemesterStatusChartProps) {
  const filteredData = statusData.filter((d) => d.value > 0);

  return (
    <CardLayout
      title={
        <>
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">Semester Status</span>
          <span className="text-sm text-gray-500">
            Distribution of semesters by status
          </span>
        </>
      }
      titleClassName="flex flex-col items-center mb-4"
    >
      <div className="flex flex-col flex-1 min-h-[350px]">
        <ChartContainer
          config={defaultChartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={filteredData} dataKey="value" nameKey="name" />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" payload={[]} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
    </CardLayout>
  );
}
