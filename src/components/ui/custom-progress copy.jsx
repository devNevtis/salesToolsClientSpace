// src/components/ui/custom-progress.jsx
"use client"

import { cn } from "@/lib/utils"

const CustomProgress = ({ className, value = 0, ...props }) => {
  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-200"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          willChange: "transform"
        }}
      />
    </div>
  )
}

CustomProgress.displayName = "CustomProgress"

export { CustomProgress }