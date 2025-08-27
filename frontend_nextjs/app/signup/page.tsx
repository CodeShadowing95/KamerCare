"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, ArrowLeft, Shield, CheckCircle, Users, Clock, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    region: "",
    city: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const cameroonRegions = [
    "Adamaoua", "Centre", "Est", "Extrême-Nord", "Littoral",
    "Nord", "Nord-Ouest", "Ouest", "Sud", "Sud-Ouest"
  ]

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("Le prénom est requis")
      return false
    }
    if (!formData.lastName.trim()) {
      setError("Le nom est requis")
      return false
    }
    if (!formData.email.trim()) {
      setError("L'email est requis")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Le téléphone est requis")
      return false
    }
    if (!formData.dateOfBirth) {
      setError("La date de naissance est requise")
      return false
    }
    if (!formData.region) {
      setError("La région est requise")
      return false
    }
    if (!formData.city.trim()) {
      setError("La ville est requise")
      return false
    }
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }
    if (!formData.acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        region: formData.region,
        city: formData.city,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: 'patient'
      }

      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registrationData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          region: "",
          city: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false
        })
        window.location.href = '/login'
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat()
          setError(errorMessages.join(', '))
        } else {
          setError(data.message || "Une erreur s'est produite lors de l'inscription")
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      setError("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getFormProgress = () => {
    const fields = Object.values(formData)
    const filledFields = fields.filter(field => field !== "" && field !== false).length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col lg:flex-row">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Left Column - Header & Progress */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-start relative z-10">
        {/* Header */}
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transition-colors duration-200 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center justify-start mb-6">
            <div className="w-20 h-20">
              <img 
                src="/KamerCare-logo.png" 
                alt="KamerCare Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Rejoignez KamerCare
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 lg:mb-8">
            Créez votre compte pour accéder aux meilleurs soins de santé du Cameroun
          </p>

          {/* Stats */}
          <div className="space-y-3 sm:space-y-4 mb-6 lg:mb-8 hidden sm:block">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">+10,000 patients</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Font confiance à notre plateforme</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">100% sécurisé</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vos données sont protégées</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">24h/24</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Support disponible</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Progression</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{getFormProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${getFormProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-10">
        {/* Signup Form */}
        <div className="w-full max-w-lg">
          <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl sm:rounded-2xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
                    <AlertDescription className="text-red-700 dark:text-red-400 text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-700 dark:text-emerald-400 text-sm">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50/50 to-emerald-50/50 dark:from-gray-800/50 dark:to-emerald-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-emerald-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Informations personnelles
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2 group">
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        Prénom *
                        <span className="ml-1 text-red-500">•</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Jean"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        Nom *
                        <span className="ml-1 text-red-500">•</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Date de naissance *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Coordonnées
                    </h3>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Email *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Téléphone *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+237 6XX XXX XXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 group">
                      <Label htmlFor="region" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        Région *
                        <span className="ml-1 text-red-500">•</span>
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger className="w-full h-10 min-h-[2.5rem] text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 flex items-center">
                          <SelectValue placeholder="Sélectionnez votre région" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {cameroonRegions.map((region) => (
                            <SelectItem key={region} value={region} className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        Ville *
                        <span className="ml-1 text-red-500">•</span>
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                        <Input
                          id="city"
                          name="city"
                          placeholder="Yaoundé"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="pl-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                      Sécurité
                    </h3>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Mot de passe *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum 8 caractères, incluant majuscules, minuscules et chiffres
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Confirmer le mot de passe *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-2 border-purple-300 text-purple-600 focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                        required
                      />
                    </div>
                    <Label htmlFor="acceptTerms" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 cursor-pointer">
                      <p className="font-medium">
                        En créant votre compte, vous acceptez nos{" "}
                        <Link 
                          href="/terms" 
                          className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          conditions d'utilisation
                        </Link>
                        {" "}et notre{" "}
                        <Link 
                          href="/privacy" 
                          className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          politique de confidentialité
                        </Link>
                        .
                      </p>
                    </Label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-b-xl">
                <div className="w-full space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Création du compte...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Créer mon compte</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Déjà un compte ?</span>
                      <Link 
                        href="/login" 
                        className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-purple-300 hover:decoration-purple-500 transition-all duration-200"
                      >
                        Se connecter
                      </Link>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 font-serif">
            <p>Plateforme sécurisée pour vos rendez-vous médicaux</p>
            <p className="mt-1">🇨🇲 Service public du Cameroun</p>
          </div>
        </div>
      </div>
    </div>
  )
}
