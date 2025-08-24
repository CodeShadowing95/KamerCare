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
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, Heart, ArrowLeft, Shield, CheckCircle, Users, Clock, UserPlus } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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
    acceptTerms: false,
  })

  const cameroonRegions = [
    "Adamaoua",
    "Centre",
    "Est",
    "Extrême-Nord",
    "Littoral",
    "Nord",
    "Nord-Ouest",
    "Ouest",
    "Sud",
    "Sud-Ouest",
  ]

  const validateForm = () => {
    // Validation du nom et prénom
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      setError("Le prénom doit contenir au moins 2 caractères")
      return false
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      setError("Le nom doit contenir au moins 2 caractères")
      return false
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide")
      return false
    }

    // Validation du téléphone
    const phoneRegex = /^[+]?[0-9]{8,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError("Veuillez entrer un numéro de téléphone valide")
      return false
    }

    // Validation de la date de naissance
    if (!formData.dateOfBirth) {
      setError("Veuillez sélectionner votre date de naissance")
      return false
    }

    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 16 || age > 120) {
      setError("Vous devez avoir entre 16 et 120 ans")
      return false
    }

    // Validation de la région et ville
    if (!formData.region) {
      setError("Veuillez sélectionner votre région")
      return false
    }

    if (!formData.city.trim()) {
      setError("Veuillez entrer votre ville")
      return false
    }

    // Validation du mot de passe
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
      setError("Veuillez accepter les conditions d'utilisation")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation du formulaire
    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Préparation des données pour l'API
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        region: formData.region,
        city: formData.city,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: 'patient' // Par défaut, les utilisateurs s'inscrivent comme patients
      }

      // Appel à l'API d'inscription
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Compte créé avec succès ! Vérifiez votre email pour activer votre compte.")
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
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
            acceptTerms: false,
          })
        }, 2000)
      } else {
        // Gestion des erreurs de validation du serveur
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat()
          setError(errorMessages[0] as string)
        } else if (data.message) {
          setError(data.message)
        } else {
          setError("Une erreur est survenue lors de l'inscription")
        }
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      setError("Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getFormProgress = () => {
    const fields = Object.values(formData)
    const filledFields = fields.filter(field => field !== "" && field !== false).length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors duration-200 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 p-4 rounded-2xl shadow-lg">
              <Heart className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Créer un compte patient
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-6">
            Rejoignez la plateforme de santé du Cameroun
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-2 mx-auto">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">10,000+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Patients inscrits</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-2 mx-auto">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">100%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sécurisé</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full mb-2 mx-auto">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">24/7</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Disponible</p>
            </div>
          </div>
        </div>

        {/* Circular Progress - Fixed Position */}
         <div className="fixed bottom-6 right-6 z-50">
           <div className="text-center mb-2">
             <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progression</span>
           </div>
           <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - getFormProgress() / 100)}`}
                className="text-purple-600 transition-all duration-300 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {Math.round(getFormProgress())}%
              </span>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden">

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-8 p-8">
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <AlertDescription className="text-red-700 dark:text-red-400 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-6 p-6 bg-gradient-to-r from-gray-50/50 to-emerald-50/50 dark:from-gray-800/50 dark:to-emerald-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Informations personnelles
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Prénom *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Nom *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
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
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Coordonnées
                  </h3>
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    Email *
                    <span className="ml-1 text-red-500">•</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean.dupont@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
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
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <Label htmlFor="region" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      Région *
                      <span className="ml-1 text-red-500">•</span>
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("region", value)}>
                      <SelectTrigger className="w-full h-12 min-h-[3rem] rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 flex items-center">
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
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                      <Input
                        id="city"
                        name="city"
                        placeholder="Yaoundé"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="pl-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-6 p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sécurité
                  </h3>
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    Mot de passe *
                    <span className="ml-1 text-red-500">•</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded-lg border-2 border-purple-300 text-purple-600 focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                      required
                    />
                  </div>
                  <Label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 cursor-pointer">
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

            <CardFooter className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-b-2xl">
              <div className="w-full space-y-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Création du compte...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="h-5 w-5" />
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
  )
}
