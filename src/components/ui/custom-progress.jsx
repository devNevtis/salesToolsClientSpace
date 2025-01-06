// src/components/ui/custom-progress.jsx
"use client"
import { cn } from "@/lib/utils"

const CustomProgress = ({ className, value = 0, ...props }) => {
  return (
    <div
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-slate-100",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-200"
        style={{ 
          width: `${value}%`,
          backgroundColor: '#224f5a'
        }}
      />
    </div>
  )
}

export { CustomProgress }