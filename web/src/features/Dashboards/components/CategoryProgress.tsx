import { BookOpen } from "lucide-react";
import CardLayout from "@/shared/CardLayout";

interface CategoryProgressItem {
  name: string;
  planned: number;
  required: number;
  color: string;
}

interface CategoryProgressProps {
  categoryProgress: CategoryProgressItem[];
}

export function CategoryProgress({ categoryProgress }: CategoryProgressProps) {
  return (
    <CardLayout
      title={
        <>
          <BookOpen className="h-5 w-5 text-primary" />
          Progress by Category
        </>
      }
    >
      <div className="space-y-4">
        {categoryProgress.map((category) => {
          const percentage = (category.planned / category.required) * 100;
          return (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {category.planned} / {category.required}
                  </span>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </CardLayout>
  );
}
