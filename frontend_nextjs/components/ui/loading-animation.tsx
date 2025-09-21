"use client"

import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "pulse" | "spin" | "bounce" | "wave"
}

export function LoadingAnimation({ 
  className, 
  size = "md", 
  variant = "pulse" 
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-blue-500 rounded-full animate-bounce",
              size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.6s"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "bounce") {
    return (
      <div className={cn(sizeClasses[size], "animate-bounce", className)}>
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full" />
      </div>
    )
  }

  if (variant === "spin") {
    return (
      <div className={cn(sizeClasses[size], "animate-spin", className)}>
        <div className="w-full h-full border-2 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
    )
  }

  // Default pulse variant
  return (
    <div className={cn(sizeClasses[size], "animate-pulse", className)}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full" />
    </div>
  )
}