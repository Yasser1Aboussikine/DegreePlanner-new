import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const progressColor = (style as React.CSSProperties & { '--progress-background'?: string })?.[
    '--progress-background'
  ] || 'hsl(var(--primary))';

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      style={style}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: progressColor
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
