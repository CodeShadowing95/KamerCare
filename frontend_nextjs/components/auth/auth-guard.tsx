"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "patient" | "doctor" | "admin"
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole = "patient", redirectTo = "/login" }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate auth check - replace with real authentication logic
    const checkAuth = async () => {
      try {
        // Check if user is authenticated and has required role
        const token = localStorage.getItem("auth_token")
        const userRole = localStorage.getItem("user_role")

        if (token && userRole === requiredRole) {
          setIsAuthenticated(true)
        } else {
          router.push(redirectTo)
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredRole, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-serif">Vérification de l'authentification...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect is handled in useEffect
  }

  return <>{children}</>
}
