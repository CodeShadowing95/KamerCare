"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Heart, ArrowLeft, Shield, Stethoscope, CheckCircle, Pill, Syringe, Thermometer, Activity, Cross, Zap, Brain, Microscope, Bandage, Clipboard } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already authenticated - Redirection automatique basée sur les rôles
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const userData = localStorage.getItem('auth_user')
      if (userData) {
        const user = JSON.parse(userData)
        const userRole = user.role
        
        // Redirection automatique selon le rôle utilisateur
        if (userRole === 'doctor') {
          router.push('/doctor')
        } else if (userRole === 'admin') {
          router.push('/admin')
        } else {
          // Pour tout autre rôle (patient, etc.), rediriger vers la page d'accueil
          router.push('/')
        }
      } else {
        // Si pas de données utilisateur, rediriger vers la page d'accueil
        router.push('/')
      }
    }
  }, [isAuthenticated, authLoading, router])

  // Check for signup success parameter and show toast
  useEffect(() => {
    const signupSuccess = searchParams.get('signup')
    if (signupSuccess === 'success') {
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        variant: "default",
        duration: 5000,
      })
      // Clean up the URL parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('signup')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        // Get user data from localStorage to determine role
        const userStr = localStorage.getItem('auth_user')
        if (userStr) {
          const user = JSON.parse(userStr)
          
          setSuccess("Connexion réussie ! Redirection en cours...")
          
          // Redirect based on user role
          if (user.role === 'doctor') {
            // Clear localStorage and redirect to doctor page
            // localStorage.clear()
            toast({
              title: "Redirection",
              description: "Redirection vers la page docteur...",
              variant: "default",
            })
            setTimeout(() => {
              router.push('/doctor')
            }, 1000)
          } else if (user.role === 'admin') {
            toast({
              title: "Connexion réussie",
              description: "Redirection vers le panneau d'administration...",
              variant: "default",
            })
            setTimeout(() => {
              router.push('/admin')
            }, 1000)
          } else {
            // Success for patients - utiliser redirectTo en priorité
            const finalRedirectUrl = redirectUrl || '/'
            toast({
              title: "Connexion réussie",
              description: redirectUrl ? "Redirection vers la page précédente..." : "Redirection vers la page d'accueil...",
              variant: "default",
            })
            setTimeout(() => {
              window.location.href = finalRedirectUrl
            }, 1000)
          }
        } else {
          // Fallback redirect for patients - utiliser redirectUrl en priorité
          const finalRedirectUrl = redirectUrl || '/'
          setSuccess("Connexion réussie ! Redirection en cours...")
          toast({
            title: "Connexion réussie",
            description: redirectUrl ? "Redirection vers la page précédente..." : "Redirection vers la page d'accueil...",
            variant: "default",
          })
          setTimeout(() => {
            window.location.href = finalRedirectUrl
          }, 1000)
        }
      } else {
        setError(result.error || "Échec de la connexion")
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-green-200/20 rounded-full blur-3xl"></div>
        
        {/* Static medical icons scattered across the page */}
        <div className="absolute top-10 left-10">
          <Heart className="w-6 h-6 text-red-500 opacity-60" />
        </div>
        <div className="absolute top-20 right-20">
          <Stethoscope className="w-7 h-7 text-emerald-500 opacity-50" />
        </div>
        <div className="absolute top-32 left-1/4">
          <Pill className="w-5 h-5 text-blue-500 opacity-70" />
        </div>
        <div className="absolute top-40 right-1/3">
          <Syringe className="w-6 h-6 text-purple-500 opacity-60" />
        </div>
        <div className="absolute top-1/2 left-16">
          <Thermometer className="w-6 h-6 text-orange-500 opacity-50" />
        </div>
        <div className="absolute top-1/3 right-16">
          <Activity className="w-7 h-7 text-green-500 opacity-65" />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <Cross className="w-8 h-8 text-yellow-500 opacity-55" />
        </div>
        <div className="absolute bottom-40 right-1/4">
          <Zap className="w-5 h-5 text-pink-500 opacity-60" />
        </div>
        <div className="absolute bottom-32 left-20">
          <Brain className="w-6 h-6 text-cyan-500 opacity-70" />
        </div>
        <div className="absolute bottom-20 right-10">
          <Microscope className="w-7 h-7 text-amber-500 opacity-50" />
        </div>
        <div className="absolute top-1/4 left-1/2">
          <Bandage className="w-6 h-6 text-indigo-500 opacity-65" />
        </div>
        <div className="absolute bottom-1/4 right-1/2">
          <Clipboard className="w-5 h-5 text-teal-500 opacity-55" />
        </div>
        <div className="absolute top-3/4 left-1/5">
          <Shield className="w-6 h-6 text-rose-500 opacity-60" />
        </div>
        <div className="absolute top-16 left-3/4">
          <Heart className="w-5 h-5 text-violet-500 opacity-50" />
        </div>
        <div className="absolute bottom-16 left-1/2">
          <Stethoscope className="w-6 h-6 text-blue-400 opacity-65" />
        </div>
        <div className="absolute top-60 left-32">
          <Pill className="w-5 h-5 text-lime-500 opacity-60" />
        </div>
        <div className="absolute bottom-60 right-32">
          <Brain className="w-6 h-6 text-fuchsia-500 opacity-55" />
        </div>
        <div className="absolute top-80 right-40">
          <Activity className="w-7 h-7 text-sky-500 opacity-65" />
        </div>
        <div className="absolute bottom-80 left-40">
          <Cross className="w-6 h-6 text-emerald-600 opacity-50" />
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-4 animate-fade-in">
          <Link href="/" className={`inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-all duration-300 hover:scale-105 group ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed hover:text-emerald-600 hover:scale-100' : ''}`}>
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-3xl transition-all duration-300 animate-slide-up">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Se connecter
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Entrez vos identifiants pour accéder à votre espace sécurisé
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 animate-shake">
                  <AlertDescription className="text-red-700 dark:text-red-400 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                  <AlertDescription className="text-emerald-700 dark:text-emerald-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3 group">
                <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Adresse email
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 rounded-xl bg-gray-50/50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  Mot de passe
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 rounded-xl bg-gray-50/50 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200 p-1 rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />
                  </div>
                  <Label htmlFor="remember" className={`text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-emerald-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed hover:text-gray-600' : ''}`}>
                    Se souvenir de moi
                  </Label>
                </div>
                <Link 
                  href="/forgot-password" 
                  className={`text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2 ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed hover:text-emerald-600 hover:no-underline' : ''}`}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-6 px-6 pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Se connecter</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <span className={`text-gray-600 dark:text-gray-400 ${isLoading ? 'opacity-50' : ''}`}>Pas encore de compte ? </span>
                <Link 
                  href="/signup" 
                  className={`text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2 ${isLoading ? 'opacity-50 pointer-events-none cursor-not-allowed hover:text-emerald-600 hover:no-underline' : ''}`}
                >
                  Créer un compte
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.7s ease-out 0.2s both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        

      `}</style>
    </div>
  )
}