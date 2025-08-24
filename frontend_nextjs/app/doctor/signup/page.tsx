"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Stethoscope, Shield, ArrowLeft, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export default function DoctorSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    hospital: "",
    licenseNumber: "",
    experience: "",
    bio: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const specialties = [
    "Médecine générale",
    "Cardiologie",
    "Pédiatrie",
    "Gynécologie-Obstétrique",
    "Chirurgie générale",
    "Neurologie",
    "Psychiatrie",
    "Dermatologie",
    "Ophtalmologie",
    "ORL",
    "Orthopédie",
    "Radiologie",
    "Anesthésie-Réanimation",
    "Médecine interne",
    "Pneumologie",
  ]

  const hospitals = [
    "Hôpital Central de Yaoundé",
    "Hôpital Laquintinie - Douala",
    "Hôpital Régional de Bafoussam",
    "Hôpital de District de Mbalmayo",
    "Centre Hospitalier d'Essos",
    "Hôpital Gynéco-Obstétrique de Yaoundé",
    "Autre (préciser dans la bio)",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms || !acceptPrivacy) {
      alert("Veuillez accepter les conditions d'utilisation et la politique de confidentialité")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Demande d'inscription envoyée ! Vous recevrez un email de validation sous 24-48h.")
      window.location.href = "/doctor/login"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
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
              <CardTitle className="text-2xl font-bold text-foreground">Inscription Médecin</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Rejoignez la plateforme professionnelle de santé du Cameroun
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Shield className="w-4 h-4 text-primary" />
              <span>Inscription sécurisée - Validation sous 24-48h</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Informations personnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium">
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="h-12 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium">
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="h-12 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email professionnel *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="dr.dupont@hopital.cm"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-12 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-12 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Informations professionnelles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-foreground font-medium">
                      Spécialité médicale *
                    </Label>
                    <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                      <SelectTrigger className="h-12 bg-input border-border focus:border-primary">
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital" className="text-foreground font-medium">
                      Hôpital d'exercice *
                    </Label>
                    <Select value={formData.hospital} onValueChange={(value) => handleInputChange("hospital", value)}>
                      <SelectTrigger className="h-12 bg-input border-border focus:border-primary">
                        <SelectValue placeholder="Sélectionnez votre hôpital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital} value={hospital}>
                            {hospital}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-foreground font-medium">
                      Numéro d'ordre *
                    </Label>
                    <Input
                      id="licenseNumber"
                      placeholder="CM/ORD/XXXX"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      className="h-12 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-foreground font-medium">
                      Années d'expérience *
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger className="h-12 bg-input border-border focus:border-primary">
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 ans</SelectItem>
                        <SelectItem value="3-5">3-5 ans</SelectItem>
                        <SelectItem value="6-10">6-10 ans</SelectItem>
                        <SelectItem value="11-15">11-15 ans</SelectItem>
                        <SelectItem value="16+">Plus de 15 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-foreground font-medium">
                    Présentation professionnelle
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Décrivez brièvement votre parcours et vos domaines d'expertise..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="min-h-[100px] bg-input border-border focus:border-primary resize-none"
                    rows={4}
                  />
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Sécurité du compte
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe sécurisé"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="h-12 bg-input border-border focus:border-primary pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    J'accepte les{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                      conditions d'utilisation
                    </Link>{" "}
                    de la plateforme professionnelle
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    J'accepte la{" "}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                      politique de confidentialité
                    </Link>{" "}
                    et le traitement de mes données médicales
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading || !acceptTerms || !acceptPrivacy}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Soumettre ma demande</span>
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
                  <span className="bg-card px-4 text-muted-foreground">Déjà inscrit ?</span>
                </div>
              </div>

              <Link href="/doctor/login">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  Se connecter à mon compte
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
          <p>Inscription sécurisée pour les professionnels de santé</p>
        </div>
      </div>
    </div>
  )
}
