"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Stethoscope, Shield, ArrowLeft, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function DoctorLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to doctor dashboard
      window.location.href = "/doctor"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to portal button */}
        <div className="mb-6">
          <Link href="/doctor-portal">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'espace professionnel
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
              <Stethoscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Connexion Médecin</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Accédez à votre espace professionnel sécurisé
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Shield className="w-4 h-4 text-primary" />
              <span>Connexion sécurisée - Données médicales protégées</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email professionnel
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.exemple@hopital.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-input border-border focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe sécurisé"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-input border-border focus:border-primary pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  href="/doctor/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">Nouveau médecin ?</span>
                </div>
              </div>

              <Link href="/doctor/signup">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Créer un compte professionnel
                </Button>
              </Link>
            </div>

            {/* Patient Portal Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Vous êtes un patient ?</p>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                  Accéder à l'espace patient
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2024 Ministère de la Santé Publique du Cameroun</p>
          <p>Plateforme sécurisée pour les professionnels de santé</p>
        </div>
      </div>
    </div>
  )
}
