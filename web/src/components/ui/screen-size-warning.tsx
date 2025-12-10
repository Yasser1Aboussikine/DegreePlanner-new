import { Monitor, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ScreenSizeWarning = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Monitor className="h-6 w-6 text-primary" />
            Use a Bigger Screen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertDescription className="ml-2">
              This content is too large for your current screen size.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              The Degree Plan Builder requires a larger screen for the best experience.
            </p>
            <p className="font-medium">
              Please switch to a desktop or tablet device with a minimum width of 1024px.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Monitor className="h-4 w-4" />
            <span>Recommended: Desktop or Laptop</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
