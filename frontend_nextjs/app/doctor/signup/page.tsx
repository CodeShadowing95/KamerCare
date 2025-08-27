"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, MapPin, Building, GraduationCap, Award, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, UserPlus, Shield, AlertTriangle, FileText, Stethoscope, Heart, Users, Home } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export default function DoctorSignup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Personal information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    
    // Step 2: Professional information
    specialty: "",
    hospital: "",
    licenseNumber: "",
    yearsOfExperience: "",
    education: "",
    certifications: "",
    references: "",
    
    // Step 3: Security
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const totalSteps = 3
  const stepTitles = [
    "Informations personnelles",
    "Authentification professionnelle", 
    "Securite et finalisation"
  ]
  
  useEffect(() => {
    setIsVisible(true)
    setIsClient(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const specialties = [
    "Medecine generale",
    "Cardiologie",
    "Dermatologie",
    "Neurologie",
    "Pediatrie",
    "Gynecologie",
    "Orthopedie",
    "Psychiatrie",
    "Radiologie",
    "Anesthesiologie"
  ]
  
  const hospitals = [
    "Hopital Central de Yaounde",
    "Hopital General de Douala",
    "Hopital Laquintinie",
    "Centre Hospitalier d'Essos",
    "Hopital de District de Biyem-Assi",
    "Clinique Pasteur",
    "Autre"
  ]
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth && formData.address && formData.city
      case 2:
        return formData.specialty && formData.hospital && formData.licenseNumber && formData.yearsOfExperience && formData.education
      case 3:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.agreeToTerms
      default:
        return false
    }
  }
  
  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    // API request simulation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log("Form data:", formData)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}px`,
            top: `${mousePosition.y * 0.01}px`,
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-pink-300/20 rounded-full blur-2xl animate-pulse"
          style={{
            right: isClient ? `${(window.innerWidth - mousePosition.x) * 0.008}px` : '0px',
            bottom: isClient ? `${(window.innerHeight - mousePosition.y) * 0.008}px` : '0px',
          }}
        />
        
        {/* Logo en arrière-plan */}
        <div className="absolute -right-36 -top-12 transform -translate-y-12 opacity-8 pointer-events-none">
          <img 
            src="/KamerCare-logo.png" 
            alt="KamerCare Logo" 
            className="w-[50vw] h-[50vw] object-contain filter grayscale"
          />
        </div>
      </div>
      
      {/* Bouton de retour à l'accueil */}
       <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 text-gray-800 hover:text-blue-600">
         <Home className="w-4 h-4" />
         <span className="text-xs font-medium">Retour à l'accueil</span>
       </Link>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl leading-tight md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Rejoignez la revolution medicale
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Creez votre compte professionnel et rejoignez notre communaute medicale.
            </p>
            
            <div className="flex justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Inscription securisee et verifiee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Acces a tous les outils medicaux</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-yellow-600" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Suivi patient en temps reel</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              © 2024 KamerCare. Tous droits reserves.
            </p>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                    Inscription Medecin
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    {stepTitles[currentStep - 1]}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Step Indicator */}
              <div className="flex justify-center mb-8 relative z-10">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg
                        ${
                          currentStep === step
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-300 scale-110'
                            : currentStep > step
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-300'
                            : 'bg-gray-200 text-gray-500 shadow-gray-200'
                        }
                      `}>
                        {currentStep > step ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      {step < 3 && (
                        <div className={`
                          w-16 h-1 mx-2 rounded-full transition-all duration-300
                          ${
                            currentStep > step
                              ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                              : 'bg-gray-200'
                          }
                        `} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            Prenom *
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="Votre prenom"
                            required
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-green-100 rounded-lg mr-2">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            Nom *
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="Votre nom"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                              <Mail className="w-4 h-4 text-purple-600" />
                            </div>
                            Email *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="votre.email@exemple.com"
                            required
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-indigo-100 rounded-lg mr-2">
                              <Phone className="w-4 h-4 text-indigo-600" />
                            </div>
                            Telephone *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="+237 6XX XXX XXX"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-pink-100 rounded-lg mr-2">
                            <Calendar className="w-4 h-4 text-pink-600" />
                          </div>
                          Date de naissance *
                        </Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-yellow-100 rounded-lg mr-2">
                              <MapPin className="w-4 h-4 text-yellow-600" />
                            </div>
                            Adresse *
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="Votre adresse complete"
                            required
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-teal-100 rounded-lg mr-2">
                              <Building className="w-4 h-4 text-teal-600" />
                            </div>
                            Ville *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="Votre ville"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Professional Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="specialty" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                              <Stethoscope className="w-4 h-4 text-blue-600" />
                            </div>
                            Specialite medicale *
                          </Label>
                          <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md">
                              <SelectValue placeholder="Selectionnez votre specialite" />
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
                        
                        <div className="space-y-3">
                          <Label htmlFor="hospital" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-green-100 rounded-lg mr-2">
                              <Building className="w-4 h-4 text-green-600" />
                            </div>
                            Hopital/Clinique *
                          </Label>
                          <Select value={formData.hospital} onValueChange={(value) => handleInputChange('hospital', value)}>
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md">
                              <SelectValue placeholder="Selectionnez votre etablissement" />
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                              <FileText className="w-4 h-4 text-purple-600" />
                            </div>
                            Numero de licence medicale *
                          </Label>
                          <Input
                            id="licenseNumber"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                            placeholder="Ex: CM-MD-2024-001234"
                            required
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="yearsOfExperience" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-indigo-100 rounded-lg mr-2">
                              <Award className="w-4 h-4 text-indigo-600" />
                            </div>
                            Annees d'experience *
                          </Label>
                          <Select value={formData.yearsOfExperience} onValueChange={(value) => handleInputChange('yearsOfExperience', value)}>
                            <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md">
                              <SelectValue placeholder="Selectionnez vos annees d'experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">0-2 ans</SelectItem>
                              <SelectItem value="3-5">3-5 ans</SelectItem>
                              <SelectItem value="6-10">6-10 ans</SelectItem>
                              <SelectItem value="11-15">11-15 ans</SelectItem>
                              <SelectItem value="16-20">16-20 ans</SelectItem>
                              <SelectItem value="20+">Plus de 20 ans</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="education" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-pink-100 rounded-lg mr-2">
                            <GraduationCap className="w-4 h-4 text-pink-600" />
                          </div>
                          Formation medicale *
                        </Label>
                        <Textarea
                          id="education"
                          name="education"
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          className="min-h-[100px] border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md resize-none"
                          placeholder="Decrivez votre parcours de formation medicale (universite, diplomes, etc.)"
                          required
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="certifications" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-yellow-100 rounded-lg mr-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                          </div>
                          Certifications (optionnel)
                        </Label>
                        <Textarea
                          id="certifications"
                          name="certifications"
                          value={formData.certifications}
                          onChange={(e) => handleInputChange('certifications', e.target.value)}
                          className="min-h-[80px] border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md resize-none"
                          placeholder="Listez vos certifications professionnelles"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="references" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-teal-100 rounded-lg mr-2">
                            <Users className="w-4 h-4 text-teal-600" />
                          </div>
                          References professionnelles (optionnel)
                        </Label>
                        <Textarea
                          id="references"
                          name="references"
                          value={formData.references}
                          onChange={(e) => handleInputChange('references', e.target.value)}
                          className="min-h-[80px] border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md resize-none"
                          placeholder="Contacts de collegues ou superviseurs pouvant attester de votre competence (Nom, email et numero de telephone)"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Security */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-red-100 rounded-lg mr-2">
                            <Lock className="w-4 h-4 text-red-600" />
                          </div>
                          Mot de passe *
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md pr-12"
                            placeholder="Mot de passe securise"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-orange-100 rounded-lg mr-2">
                            <Lock className="w-4 h-4 text-orange-600" />
                          </div>
                          Confirmer le mot de passe *
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="h-12 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md pr-12"
                            placeholder="Confirmer le mot de passe"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                        <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                          <div className="p-1 bg-blue-200 rounded-lg mr-2">
                            <Shield className="w-4 h-4 text-blue-700" />
                          </div>
                          Criteres de securite du mot de passe
                        </h4>
                        <ul className="text-xs text-blue-700 space-y-1.5">
                          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Au moins 8 caracteres</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Une lettre majuscule et une minuscule</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Au moins un chiffre</li>
                          <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Un caractere special (@, #, $, etc.)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-3 flex items-center">
                          <div className="p-1 bg-yellow-200 rounded-lg mr-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-700" />
                          </div>
                          Verification des informations
                        </h4>
                        <p className="text-xs text-yellow-700 leading-relaxed">
                          Vos informations professionnelles seront verifiees par notre equipe avant l'activation de votre compte. Ce processus peut prendre 24-48 heures.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="agreeToTerms"
                              checked={formData.agreeToTerms}
                              onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                              className="mt-1 border-2 border-green-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            <Label htmlFor="agreeToTerms" className="cursor-pointer">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                J'accepte les{" "}
                                <a href="/terms" className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors duration-200">
                                  conditions d'utilisation
                                </a>
                                {" "}et la{" "}
                                <a href="/privacy" className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors duration-200">
                                  politique de confidentialite
                                </a>
                                {" "}de KamerCare. Je certifie que toutes les informations fournies sont exactes et a jour.
                              </p>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center text-gray-700 space-x-2 px-8 py-3 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Precedent</span>
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="flex items-center space-x-2 px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <span className="font-medium">Suivant</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!validateStep(3) || isLoading}
                      className="flex items-center space-x-2 px-8 py-3 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      <span className="font-medium">Creer mon compte</span>
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
