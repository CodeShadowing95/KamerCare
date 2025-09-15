"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, MapPin, Building, GraduationCap, Award, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, UserPlus, Shield, AlertTriangle, FileText, Stethoscope, Heart, Users, Home, ChevronLeft, ChevronRight, Briefcase, DollarSign, Building2, Clock, MapPinned } from "lucide-react"
import { DoctorSpecialization } from "@/components/ui/doctor-specialization"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { apiService, DoctorRegistrationData, ConsultationHours, TimeSlot } from "../../../lib/api"
import { useRouter } from "next/navigation"
import { useCities } from "../../../hooks/use-cities"

export default function DoctorSignup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // États pour la gestion des villes avec auto-complétion
  const [citySearchTerm, setCitySearchTerm] = useState('')
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)

  // Hook pour la gestion des villes
  const { searchCities, searchResults, loading: citiesLoading, error: citiesError } = useCities()
  
  // Générer les 7 jours à partir du lendemain
  const generateWeekDays = () => {
    const days = []
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(tomorrow)
      currentDate.setDate(tomorrow.getDate() + i)
      
      const dateStr = currentDate.toISOString().split('T')[0] // Format YYYY-MM-DD
      const dayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })
      
      days.push({
        key: dateStr,
        label: `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} (${currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })})`,
        date: dateStr
      })
    }
    return days
  }
  
  const weekDays = generateWeekDays()
  
  // Initialiser consultation_hours avec les dates dynamiques
  const initializeConsultationHours = () => {
    const hours: any = {}
    weekDays.forEach(day => {
      hours[day.key] = { slots: [], available: false }
    })
    return hours
  }
  
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    city: "",

    // Étape 2: Informations professionnelles de base
    specialization: [] as string[],
    hospital: "",
    license_number: "",
    years_of_experience: "",
    education: "",
    certifications: "",
    references: "",
    bio: "",
    consultation_fee: 0,
    office_address: "",
    qualifications: "",
    is_available: true,

    // Horaires de consultation avec dates dynamiques
    consultation_hours: initializeConsultationHours(),

    // Étape 3: Sécurité
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 5
  const stepTitles = [
    "Informations personnelles",
    "Informations professionnelles de base",
    "Formation et qualifications",
    "Pratique médicale",
    "Sécurité"
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

  // Effet pour synchroniser citySearchTerm avec formData.city
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

  const specialties = [
    "Médecine Générale",
    "Anesthésie/Réanimation",
    "Chirurgie générale",
    "Chirurgie pédiatrique",
    "Gynécologie/Obstétrique",
    "Ophtalmologie",
    "Oto-rhino-laryngologie (ORL)",
    "Cardiologie",
    "Dermatologie/Vénérologie",
    "Endocrinologie/Diabétologie",
    "Gastroentérologie/Hépatologie",
    "Hématologie clinique",
    "Maladies infectieuses",
    "Médecine interne",
    "Néphrologie",
    "Neurologie",
    "Oncologie médicale",
    "Pédiatrie",
    "Psychiatrie",
    "Anatomopathologie",
    "Biochimie médicale",
    "Biologie clinique",
    "Radiologie et imagerie médicale",
    "Santé publique"
  ]

  const handleInputChange = (field: string, value: string | boolean | string[] | any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleScheduleChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => {
      const updatedDay = {
        ...prev.consultation_hours[day],
        [field]: value
      }

      // Si on active un jour et qu'il n'y a pas de créneaux, ajouter un créneau par défaut
      if (field === 'available' && value === true && updatedDay.slots.length === 0) {
        updatedDay.slots = [{
          id: `slot_${day}_1`,
          date: day, // Utiliser la clé du jour qui est déjà au format YYYY-MM-DD
          time: "",
          status: "pending"
        }]
      }

      return {
        ...prev,
        consultation_hours: {
          ...prev.consultation_hours,
          [day]: updatedDay
        }
      }
    })
  }

  const addTimeSlot = (day: string) => {
    const currentSlots = formData.consultation_hours[day]?.slots || []
    const newSlot: TimeSlot = {
      id: `slot_${day}_${currentSlots.length + 1}`,
      date: day, // Utiliser la clé du jour qui est déjà au format YYYY-MM-DD
      time: "",
      status: "pending"
    }

    setFormData(prev => ({
      ...prev,
      consultation_hours: {
        ...prev.consultation_hours,
        [day]: {
          ...prev.consultation_hours[day],
          slots: [...prev.consultation_hours[day].slots, newSlot]
        }
      }
    }))
  }

  const removeTimeSlot = (day: string, slotId: string) => {
    setFormData(prev => ({
      ...prev,
      consultation_hours: {
        ...prev.consultation_hours,
        [day]: {
          ...prev.consultation_hours[day],
          slots: prev.consultation_hours[day].slots.filter((slot: any) => slot.id !== slotId)
        }
      }
    }))
  }

  const updateTimeSlot = (day: string, slotId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      consultation_hours: {
        ...prev.consultation_hours,
        [day]: {
          ...prev.consultation_hours[day],
          slots: prev.consultation_hours[day].slots.map((slot: any) =>
            slot.id === slotId ? { ...slot, time: value } : slot
          )
        }
      }
    }))
  }

  // Fonction pour gérer la saisie dans le champ ville
  const handleCityInputChange = (value: string) => {
    setCitySearchTerm(value)
    handleInputChange('city', value)
  }

  // Fonction pour sélectionner une ville depuis les suggestions
  const handleCitySelect = (cityName: string, regionName: string) => {
    const fullCityName = regionName ? `${cityName}, ${regionName.toUpperCase()}` : cityName
    setCitySearchTerm(fullCityName)
    handleInputChange('city', fullCityName)
    setShowCitySuggestions(false)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        // Validation des informations personnelles
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[0-9+\-\s()]+$/

        return (
          formData.first_name.trim() !== '' &&
          formData.last_name.trim() !== '' &&
          formData.email.trim() !== '' &&
          emailRegex.test(formData.email) &&
          formData.phone.trim() !== '' &&
          phoneRegex.test(formData.phone) &&
          formData.date_of_birth !== '' &&
          formData.address.trim() !== '' &&
          formData.city.trim() !== ''
        )
      case 2:
        // Validation des informations professionnelles de base
        return (
          formData.specialization.length > 0 &&
          formData.license_number.trim() !== '' &&
          formData.years_of_experience !== ''
        )
      case 3:
        // Validation de la formation et qualifications
        return (
          formData.education.trim() !== '' &&
          formData.certifications.trim() !== '' &&
          formData.references.trim() !== '' &&
          formData.qualifications && typeof formData.qualifications === 'string' && formData.qualifications.trim() !== ''
        )
      case 4:
        // Validation de la pratique médicale - plus flexible pour les heures
        const hasAtLeastOneSchedule = Object.values(formData.consultation_hours).some(
          (schedule: any) => schedule.available && schedule.slots.length > 0 &&
            schedule.slots.some((slot: TimeSlot) => slot.time)
        )
        return (
          formData.bio.trim() !== '' &&
          Number(formData.consultation_fee) > 0 &&
          formData.office_address.trim() !== '' &&
          hasAtLeastOneSchedule
        )
      case 5:
        // Validation de la sécurité
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.,;:]{8,}$/

        const passwordNotEmpty = formData.password.trim() !== '';
        const confirmPasswordNotEmpty = formData.confirmPassword.trim() !== '';
        const passwordsMatch = formData.password === formData.confirmPassword;
        const passwordValid = passwordRegex.test(formData.password);
        const termsAccepted = formData.agreeToTerms === true;



        return (
          passwordNotEmpty &&
          confirmPasswordNotEmpty &&
          passwordsMatch &&
          passwordValid &&
          termsAccepted
        )
      default:
        return false
    }
  }

  const validateAllSteps = () => {
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);
    const step4Valid = validateStep(4);
    const step5Valid = validateStep(5);

    const allValid = step1Valid && step2Valid && step3Valid && step4Valid && step5Valid;

    return allValid;
  };

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

    if (!validateStep(5)) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Préparer les données pour l'API
      const doctorData: DoctorRegistrationData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        city: formData.city,
        specialization: formData.specialization,
        license_number: formData.license_number,
        phone: formData.phone,
        bio: formData.bio,
        qualifications: formData.qualifications.split('\n').filter(q => q.trim() !== ''),
        education: formData.education.split('\n').filter(e => e.trim() !== ''),
        certifications: formData.certifications.split('\n').filter(c => c.trim() !== ''),
        references: formData.references.split('\n').filter(r => r.trim() !== ''),
        years_of_experience: formData.years_of_experience,
        office_address: formData.office_address,
        consultation_fee: Number(formData.consultation_fee),
        is_available: formData.is_available,
        consultation_hours: formData.consultation_hours
      }

      const response = await apiService.registerDoctor(doctorData)

      if (response.success) {
        setSuccess('Inscription réussie ! Redirection vers la page de connexion...')
        setTimeout(() => {
          router.push('/doctor/login')
        }, 2000)
      } else {
        setError(response.message || 'Une erreur est survenue lors de l\'inscription')
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error)

      // Gestion améliorée des erreurs
      let errorMessage = 'Une erreur est survenue lors de l\'inscription'

      if (error && typeof error === 'object') {
        if (error.errors && typeof error.errors === 'object') {
          // Erreurs de validation du serveur
          const errorMessages = Object.values(error.errors)
            .flat()
            .filter(msg => typeof msg === 'string' && msg.trim() !== '')
            .join(', ')
          if (errorMessages) {
            errorMessage = errorMessages
          }
        } else if (error.message && typeof error.message === 'string') {
          errorMessage = error.message
        } else if (error.data && error.data.message) {
          errorMessage = error.data.message
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
        <div className="absolute -left-96 -top-36 transform -translate-y-36 opacity-15 pointer-events-none">
          <img
            src="/KamerCare-logo.png"
            alt="KamerCare Logo"
            className="w-[70vw] h-[70vw] object-contain filter grayscale"
          />
        </div>

        {/* Logo en arrière-plan 2 */}
        <div className="absolute -right-32 -bottom-24 transform -translate-y-36 opacity-15 pointer-events-none">
          <img
            src="/KamerCare-logo.png"
            alt="KamerCare Logo"
            className="w-[40vw] h-[40vw] object-contain filter grayscale rotate-y-180"
          />
        </div>
      </div>

      {/* Bouton de retour à l'accueil */}
      <Link href="/doctor-portal" className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl hover:bg-white/30 hover:border-white/40 transition-all duration-300 text-gray-800 hover:text-blue-600">
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
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg
                        ${currentStep === step
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
                      {step < 5 && (
                        <div className={`
                          w-16 h-1 mx-2 rounded-full transition-all duration-300
                          ${currentStep > step
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
                      <div className="space-y-6">
                        <div className="space-y-3 w-full">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            Prenom *
                          </Label>
                          <Input
                            id="firstName"
                            name="first_name"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
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
                            name="last_name"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                          value={formData.date_of_birth}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Champ ville avec auto-complétion */}
                        <div className="space-y-3 relative">
                          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-teal-100 rounded-lg mr-2">
                              <Building className="w-4 h-4 text-teal-600" />
                            </div>
                            Ville *
                            {citiesLoading && (
                              <div className="ml-2">
                                <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                          </Label>
                          <div className="relative">
                            <Input
                              id="city"
                              name="city"
                              value={citySearchTerm}
                              onChange={(e) => handleCityInputChange(e.target.value)}
                              onFocus={() => citySearchTerm.length >= 2 && setShowCitySuggestions(true)}
                              onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                              className="h-12 border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                              placeholder="Tapez le nom de votre ville..."
                              required
                              autoComplete="off"
                            />


                            {/* Suggestions d'auto-complétion */}
                            {showCitySuggestions && (
                              <div className="absolute bottom-12 left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {citiesLoading ? (
                                  <div className="p-3 text-center text-gray-500">
                                    <div className="flex items-center justify-center space-x-2">
                                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                      <span>Recherche en cours...</span>
                                    </div>
                                  </div>
                                ) : searchResults.length > 0 ? (
                                  searchResults.map((city, index) => (
                                    <div
                                      key={`${city.city}-${city.region || 'unknown'}-${index}`}
                                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 z-50"
                                      onClick={() => handleCitySelect(city.city, city.region || '')}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <MapPinned className="w-4 h-4 text-teal-500" />
                                        <span className="text-gray-900">
                                          {city.city}{city.region && <>, <span className="text-xs font-semibold text-teal-600">{city.region.toUpperCase()}</span></>}
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : citySearchTerm.length >= 2 ? (
                                  <div className="p-3 text-xs text-center text-gray-500">
                                    Aucune ville trouvée pour "{citySearchTerm}"
                                  </div>
                                ) : (
                                  <div className="p-3 text-xs text-center text-gray-500">
                                    Tapez au moins 2 caractères pour rechercher
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {citiesError && (
                            <p className="text-xs text-red-500 mt-1">
                              Erreur: {citiesError}
                            </p>
                          )}
                        </div>

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
                      </div>

                    </div>
                  )}

                  {/* Step 2: Professional Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="specialty" className="text-sm font-semibold text-gray-700 flex items-center">
                            <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                              <Stethoscope className="w-4 h-4 text-blue-600" />
                            </div>
                            Spécialités médicales * (Sélectionnez une ou plusieurs spécialités)
                          </Label>
                          <div className="rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all duration-300 max-h-[400px] overflow-y-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {specialties.map((specialty) => (
                                <label key={specialty} className={`relative block p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 min-h-[100px] ${
                                   formData.specialization.includes(specialty)
                                     ? 'border-blue-500 bg-blue-50 shadow-md'
                                     : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                 }`}>
                                  <input
                                    type="checkbox"
                                    checked={formData.specialization.includes(specialty)}
                                    onChange={(e) => {
                                      const currentSpecializations = [...formData.specialization];
                                      if (e.target.checked) {
                                        currentSpecializations.push(specialty);
                                      } else {
                                        const index = currentSpecializations.indexOf(specialty);
                                        if (index > -1) {
                                          currentSpecializations.splice(index, 1);
                                        }
                                      }
                                      handleInputChange('specialization', currentSpecializations);
                                    }}
                                    className="sr-only"
                                  />
                                  <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className={`w-6 h-6 rounded-full border-2 mb-2 flex items-center justify-center ${formData.specialization.includes(specialty)
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-gray-300'
                                      }`}>
                                      {formData.specialization.includes(specialty) && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className={`text-xs font-medium leading-tight break-words hyphens-auto ${
                                       formData.specialization.includes(specialty)
                                         ? 'text-blue-700'
                                         : 'text-gray-700'
                                     }`} style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>{specialty}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {formData.specialization.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">Spécialités sélectionnées :</p>
                          <div className="flex flex-wrap gap-1">
                            <DoctorSpecialization 
                              specialization={formData.specialization.join(', ')}
                              className="text-xs"
                              showRemoveButtons={true}
                              onRemove={(spec) => {
                                const currentSpecializations = formData.specialization.filter(s => s !== spec);
                                handleInputChange('specialization', currentSpecializations);
                              }}
                            />
                          </div>
                        </div>
                      )}

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
                            value={formData.license_number}
                            onChange={(e) => handleInputChange('license_number', e.target.value)}
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
                          <Select value={formData.years_of_experience} onValueChange={(value) => handleInputChange('years_of_experience', value)}>
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
                    </div>
                  )}

                  {/* Step 3: Formation et qualifications */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
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

                      {/* Qualifications */}
                      <div className="space-y-3">
                        <Label htmlFor="qualifications" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-yellow-100 rounded-lg mr-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                          </div>
                          Qualifications supplémentaires
                        </Label>
                        <Textarea
                          id="qualifications"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={(e) => handleInputChange('qualifications', e.target.value)}
                          className="min-h-[80px] border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md resize-none"
                          placeholder="Listez vos qualifications supplémentaires (une par ligne)\nEx: Diplôme en cardiologie\nFormation en échographie\nCertification en urgences"
                        />
                      </div>
                    </div>
                  )}



                  {/* Step 4: Medical Practice */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      {/* Bio */}
                      <div className="space-y-3">
                        <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-blue-100 rounded-lg mr-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          Biographie professionnelle
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md resize-none"
                          placeholder="Décrivez votre parcours professionnel, vos spécialisations et votre approche médicale..."
                        />
                      </div>

                      {/* Consultation Fee */}
                      <div className="space-y-3">
                        <Label htmlFor="consultation_fee" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-green-100 rounded-lg mr-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          Tarif de consultation (FCFA)
                        </Label>
                        <Input
                          id="consultation_fee"
                          name="consultation_fee"
                          type="number"
                          value={formData.consultation_fee}
                          onChange={(e) => handleInputChange('consultation_fee', e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                          placeholder="Ex: 15000"
                          min="0"
                        />
                      </div>

                      {/* Office Address */}
                      <div className="space-y-3">
                        <Label htmlFor="office_address" className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
                            <MapPin className="w-4 h-4 text-purple-600" />
                          </div>
                          Adresse du cabinet
                        </Label>
                        <Input
                          id="office_address"
                          name="office_address"
                          value={formData.office_address}
                          onChange={(e) => handleInputChange('office_address', e.target.value)}
                          className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl transition-all duration-300 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md"
                          placeholder="Adresse complète de votre cabinet médical"
                        />
                      </div>

                      {/* Consultation Hours */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center">
                          <div className="p-1.5 bg-indigo-100 rounded-lg mr-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                          </div>
                          Horaires de consultation *
                        </Label>
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                          <p className="text-xs text-indigo-700 mb-4">Définissez vos heures de consultation précises pour les 7 prochains jours à partir de demain. Vous pouvez ajouter plusieurs heures par jour. Au moins une heure doit être configurée.</p>

                          <div className="space-y-3">
                            {weekDays.map(({ key, label }) => (
                              <div key={key} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200">
                                <div className="flex items-center space-x-2 min-w-[200px]">
                                  <Checkbox
                                    id={`${key}_available`}
                                    checked={formData.consultation_hours[key]?.available || false}
                                    onCheckedChange={(checked) => handleScheduleChange(key, 'available', !!checked)}
                                    className="border-2 border-indigo-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                  />
                                  <Label htmlFor={`${key}_available`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                    {label}
                                  </Label>
                                </div>

                                {formData.consultation_hours[key]?.available && (
                                  <div className="flex-1 space-y-2">
                                    {formData.consultation_hours[key]?.slots.map((slot: any, index: number) => (
                                      <div key={slot.id} className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-2 flex-1">
                                          <Label className="text-xs text-gray-600 min-w-[50px]">Heure:</Label>
                                          <Input
                                            type="time"
                                            value={slot.time}
                                            onChange={(e) => updateTimeSlot(key, slot.id, e.target.value)}
                                            className="h-8 text-xs border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 rounded-md"
                                            placeholder="HH:MM"
                                          />
                                        </div>
                                        {(formData.consultation_hours[key]?.slots.length || 0) > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => removeTimeSlot(key, slot.id)}
                                            className="h-8 w-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                            title="Supprimer cette heure"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => addTimeSlot(key)}
                                      className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center space-x-1"
                                    >
                                      <span>+</span>
                                      <span>Ajouter une heure</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Step 5: Security */}
                  {currentStep === 5 && (
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
                              onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
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

                {/* Messages d'erreur et de succès */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <p className="text-green-700 text-sm font-medium">{success}</p>
                    </div>
                  </div>
                )}

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
                      disabled={currentStep !== 5 || !validateAllSteps() || isLoading}
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
