import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const CourseDetailsSkeleton = () => {
  return (
    <div className="container mx-auto">
      {/* Back Button Skeleton */}
      <Skeleton className="h-10 w-40 mb-6" />

      {/* Course Header Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-7 w-3/4" />
            </div>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Elective Badges Skeleton */}
          <div className="flex gap-2 flex-wrap mt-2">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        {/* Tabs List Skeleton */}
        <div className="grid w-full grid-cols-3 gap-2 bg-muted p-1 rounded-lg">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;
