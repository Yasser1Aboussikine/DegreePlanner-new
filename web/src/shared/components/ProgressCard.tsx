import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";

interface ProgressItem {
  name: string;
  value: number;
  color?: string;
}

interface ProgressCardProps {
  title: string;
  icon: LucideIcon;
  data: ProgressItem[];
  isLoading?: boolean;
}

const getProgressColor = (index: number): string => {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--destructive))"
  ];
  return colors[index % colors.length];
};

export const ProgressCard = ({ title, icon: Icon, data, isLoading }: ProgressCardProps) => {
  const total = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      </div>
      {isLoading ? (
        <LoadingSpinner message="Loading progress data..." size={32} />
      ) : !data || data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const color = getProgressColor(index);
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-card-foreground">{item.value}</span>
                    <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  style={{
                    ['--progress-background' as string]: color
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
