"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, ArrowLeft, Shield, CheckCircle, Users, Clock, UserPlus, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCities } from "@/hooks/use-cities"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
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

  // États pour l'auto-complétion des villes
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const { searchCities, searchResults, loading: citiesLoading } = useCities()

  const genderOptions = [
    { value: "male", label: "Masculin" },
    { value: "female", label: "Féminin" },
    { value: "other", label: "Autre" }
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
    if (!formData.gender) {
      setError("Le sexe est requis")
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
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
        setSuccess("Compte créé avec succès ! Redirection vers la page de connexion...")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          city: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false
        })
        // Redirection vers la page de connexion avec paramètre de succès
        setTimeout(() => {
          router.push('/login?signup=success')
        }, 1500)
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
    
    // Gestion spéciale pour le champ ville
    if (name === 'city') {
      setCitySearchTerm(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Fonction pour gérer la saisie dans le champ ville
  const handleCityInputChange = (value: string) => {
    setCitySearchTerm(value)
    setFormData(prev => ({ ...prev, city: value }))
  }

  // Fonction pour gérer la sélection d'une ville
  const handleCitySelect = (cityName: string, region?: string) => {
    const fullCityName = region ? `${cityName}, ${region.toUpperCase()}` : cityName
    setCitySearchTerm(fullCityName)
    setFormData(prev => ({ ...prev, city: fullCityName }))
    setShowCitySuggestions(false)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Synchroniser citySearchTerm avec formData.city
  useEffect(() => {
    setCitySearchTerm(formData.city)
  }, [formData.city])

  // Effet pour rechercher les villes lors de la saisie
  useEffect(() => {
    if (citySearchTerm.length >= 2) {
      searchCities(citySearchTerm)
      setShowCitySuggestions(true)
    } else {
      setShowCitySuggestions(false)
    }
  }, [citySearchTerm, searchCities])

  // Fermer les suggestions quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-city-autocomplete]')) {
        setShowCitySuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getFormProgress = () => {
    const fields = Object.values(formData)
    const filledFields = fields.filter(field => field !== "" && field !== false).length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 via-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-300/20 via-teal-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-200/10 to-pink-200/10 rounded-full blur-2xl animate-spin-slow"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-indigo-400/30 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-teal-400/30 rounded-full animate-float"></div>
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-[0.5px]"></div>

      {/* Left Column - Header & Progress */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-start relative z-10">
        {/* Header */}
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8 transition-all duration-300 group hover:scale-105">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="font-medium">Retour à l'accueil</span>
          </Link>

          <div className="flex items-center justify-start mb-8 group">
            <div className="w-20 lg:w-28 h-20 lg:h-28 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img
                src="/KamerCare-logo.png"
                alt="KamerCare Logo"
                className="w-full h-full object-contain relative z-10 drop-shadow-lg"
              />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 leading-tight">
              Rejoignez KamerCare
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              Plateforme sécurisée pour vos rendez-vous médicaux
            </p>
          </div>

          {/* Enhanced Stats */}
          <div className="space-y-4 mb-8 hidden sm:block">
            <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">+15,000 patients</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Font confiance à notre plateforme</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">100% sécurisé</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Vos données sont protégées</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">24h/24</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Support disponible</p>
              </div>
            </div>
          </div>

          {/* Enhanced Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progression du formulaire</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{getFormProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${getFormProgress()}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-10">
        {/* Enhanced Signup Form */}
        <div className="w-full max-w-lg">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-purple-500/10 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-indigo-500/20 dark:hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 dark:from-indigo-900/20 dark:via-transparent dark:to-purple-900/20"></div>
            <div className="relative z-10 text-center pb-6 pt-8 px-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
                Créez votre compte
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                L'application de référence pour votre santé et votre bien-être
              </p>
            </div>
            <form onSubmit={handleSubmit} className="relative z-10">
              <CardContent className="space-y-6 px-8 pb-8">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
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

                {/* Enhanced Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                        Prénom *
                      </Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70"
                          placeholder="Votre prénom"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-indigo-500/10 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                        Nom *
                      </Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70"
                          placeholder="Votre nom"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-focus-within:from-indigo-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-indigo-500/10 transition-all duration-300 pointer-events-none"></div>
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

                {/* Enhanced Contact Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg">
                      <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coordonnées</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                        Email *
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70"
                          placeholder="votre@email.com"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/10 group-focus-within:via-teal-500/5 group-focus-within:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                        Téléphone *
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70"
                          placeholder="+237 6XX XXX XXX"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/10 group-focus-within:via-teal-500/5 group-focus-within:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                        Sexe *
                      </Label>
                      <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70">
                          <SelectValue placeholder="Sélectionnez votre sexe" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl">
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 group">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors flex items-center">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>Ville *</span>
                          {citiesLoading && (
                            <div className="ml-2">
                              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </Label>
                      <div className="relative" data-city-autocomplete>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={citySearchTerm}
                          onChange={(e) => handleCityInputChange(e.target.value)}
                          onFocus={() => citySearchTerm.length >= 2 && setShowCitySuggestions(true)}
                          onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70"
                          placeholder="Tapez le nom de votre ville..."
                          autoComplete="off"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-focus-within:from-emerald-500/10 group-focus-within:via-teal-500/5 group-focus-within:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
                        
                        {/* Suggestions d'auto-complétion */}
                        {showCitySuggestions && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                            {citiesLoading ? (
                              <div className="p-3 text-center text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm">Recherche en cours...</span>
                                </div>
                              </div>
                            ) : searchResults.length > 0 ? (
                              searchResults.map((city, index) => (
                                <div
                                  key={`${city.city}-${city.region || 'unknown'}-${index}`}
                                  className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  onClick={() => handleCitySelect(city.city, city.region || '')}
                                >
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs text-gray-900 dark:text-gray-100">
                                      {city.city}{city.region && <>, <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{city.region.toUpperCase()}</span></>}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : citySearchTerm.length >= 2 ? (
                              <div className="p-3 text-center text-gray-500">
                                <div className="flex items-center justify-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">Aucune ville trouvée pour "{citySearchTerm}"</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 text-center text-gray-500">
                                <span className="text-sm">Tapez au moins 2 caractères pour rechercher</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Security Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg">
                      <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sécurité</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-red-500" />
                        <span>Mot de passe</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pr-12 h-11 bg-white/70 dark:bg-gray-800/70 border-red-200 dark:border-red-700 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-400/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                          placeholder="Votre mot de passe"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-rose-500" />
                        <span>Confirmer le mot de passe</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pr-12 h-11 bg-white/70 dark:bg-gray-800/70 border-rose-200 dark:border-rose-700 focus:border-rose-400 dark:focus:border-rose-500 focus:ring-rose-400/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                          placeholder="Confirmez votre mot de passe"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-full transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-rose-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Terms Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg border-2 border-blue-300 dark:border-blue-600 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1 cursor-pointer">
                      <p className="text-xs sm:text-sm">
                        J'accepte les{" "}
                        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 font-medium transition-colors">
                          conditions d'utilisation
                        </Link>{" "}
                        et la{" "}
                        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 font-medium transition-colors">
                          politique de confidentialité
                        </Link>
                      </p>
                    </Label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 rounded-b-xl">
                <div className="w-full space-y-4">
                  {/* Enhanced Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.acceptTerms}
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center space-x-2">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Création en cours...</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5" />
                            <span>Créer mon compte</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>

                  {/* Enhanced Footer */}
                  <div className="text-center pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vous avez déjà un compte ?{" "}
                      <Link
                        href="/login"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors duration-200"
                      >
                        Se connecter
                      </Link>
                    </p>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
