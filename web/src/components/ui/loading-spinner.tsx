import { SkewLoader } from "react-spinners";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  message = "Loading...",
  size = 50,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <SkewLoader
        color="hsl(var(--primary))"
        size={size}
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
