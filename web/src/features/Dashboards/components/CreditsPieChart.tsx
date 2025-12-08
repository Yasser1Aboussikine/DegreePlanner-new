import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { Award } from "lucide-react";
import CardLayout from "@/shared/CardLayout";

interface CreditsData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface CreditsPieChartProps {
  creditsData: CreditsData[];
  totalCredits: {
    planned: number;
    total: number;
  };
}

const defaultChartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
};

export function CreditsPieChart({
  creditsData,
  totalCredits,
}: CreditsPieChartProps) {
  return (
    <CardLayout
      title={
        <>
          <Award className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">Credit Hours Progress</span>
          <span className="text-sm text-gray-500">
            {totalCredits.total - totalCredits.planned} credits remaining to
            graduate
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
            <Pie data={creditsData} dataKey="value" nameKey="name" />
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
