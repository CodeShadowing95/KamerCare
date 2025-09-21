"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MapPin,
  Heart,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  CheckCircle,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCities } from "@/hooks/use-cities"

// Interface pour le composant de recherche de ville
interface CitySearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

function CitySearchInput({ value, onChange, placeholder }: CitySearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { searchCities, searchResults, loading } = useCities()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Recherche des villes quand le terme de recherche change
  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchCities(searchTerm)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchTerm, searchCities])

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCitySelect = (city: string) => {
    onChange(city)
    setSearchTerm(city)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (newValue !== value) {
      onChange('')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={searchTerm || value}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchResults.length > 0) {
              setIsOpen(true)
            }
          }}
          className="w-full h-10 pl-10 pr-4 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 rounded-xl text-sm"
        />
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.slice(0, 10).map((city, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm transition-colors duration-150"
              onClick={() => handleCitySelect(city.city)}
            >
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-2 text-emerald-600" />
                <span>{city.city}</span>
                {city.region && (
                  <span className="ml-2 text-xs text-gray-500">({city.region})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && searchTerm.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg">
          <div className="px-3 py-2 text-sm text-gray-500">
            Recherche en cours...
          </div>
        </div>
      )}
    </div>
  )
}

interface HeroSectionProps {
  language: 'fr' | 'en'
  selectedRegion: string
  selectedCity: string
  selectedHospital: string
  selectedSpecialty: string
  setSelectedRegion: (value: string) => void
  setSelectedCity: (value: string) => void
  setSelectedHospital: (value: string) => void
  setSelectedSpecialty: (value: string) => void
  regions: any[]
  hospitals: any[]
  specialties: string[]
}

export default function HeroSection({
  language,
  selectedRegion,
  selectedCity,
  selectedHospital,
  selectedSpecialty,
  setSelectedRegion,
  setSelectedCity,
  setSelectedHospital,
  setSelectedSpecialty,
  regions,
  hospitals,
  specialties
}: HeroSectionProps) {
  const texts = {
    fr: {
      title: "Votre médecin à portée de clic",
      subtitle: "Connectez-vous instantanément aux meilleurs médecins du Cameroun",
      searchTitle: "Trouvez votre rendez-vous médical",
      searchSubtitle: "Sélectionnez vos critères de recherche",
      region: "Région",
      city: "Ville",
      hospital: "Hôpital",
      specialty: "Spécialité médicale",
      searchButton: "Rechercher des créneaux disponibles",
      regionPlaceholder: "Sélectionnez votre région",
      cityPlaceholder: "Recherchez une ville...",
      hospitalPlaceholder: "Sélectionnez un hôpital",
      specialtyPlaceholder: "Toutes les spécialités",
      stats: {
        hospitals: "Hôpitaux",
        specialties: "Spécialités",
        doctors: "Docteurs",
        available: "Disponible"
      },
      features: [
        { text: "Gratuit et sécurisé", icon: Shield },
        { text: "Confirmation instantanée", icon: CheckCircle },
        { text: "Support 24/7", icon: Clock },
        { text: "Rendez-vous rapides", icon: Calendar }
      ],
      trustBadge: "Plateforme officielle du Ministère de la Santé"
    },
    en: {
      title: "Your doctor at your fingertips",
      subtitle: "Connect instantly with Cameroon's best medical professionals",
      searchTitle: "Find your medical appointment",
      searchSubtitle: "Select your search criteria",
      region: "Region",
      city: "City",
      hospital: "Hospital",
      specialty: "Medical specialty",
      searchButton: "Search available slots",
      regionPlaceholder: "Select your region",
      cityPlaceholder: "Search for a city...",
      hospitalPlaceholder: "Select a hospital",
      specialtyPlaceholder: "All specialties",
      stats: {
        hospitals: "Hospitals",
        specialties: "Specialties",
        doctors: "Doctors",
        available: "Available"
      },
      features: [
        { text: "Free and secure", icon: Shield },
        { text: "Instant confirmation", icon: CheckCircle },
        { text: "24/7 Support", icon: Clock },
        { text: "Quick appointments", icon: Calendar }
      ],
      trustBadge: "Official platform of the Ministry of Health"
    }
  }

  const t = texts[language]
  const router = useRouter()

  const { regionsList: apiRegions, cities: apiCities, fetchCitiesByRegion, loading, error } = useCities()

  // État pour la recherche de ville
  const [citySearchTerm, setCitySearchTerm] = useState('')

  // État pour la recherche de spécialité
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Fonction pour gérer la recherche
  const handleSearch = async () => {
    if (selectedCity && selectedSpecialty && !isSearching) {
      setIsSearching(true)
      const searchParams = new URLSearchParams({
        city: selectedCity,
        specialty: selectedSpecialty
      })
      // Petit délai pour montrer le loader
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push(`/search-doctors?${searchParams.toString()}`)
    }
  }

  // Filtrer les spécialités selon le terme de recherche
  const filteredSpecialties = specialties.filter(specialty =>
    specialty.toLowerCase().includes(specialtySearchTerm.toLowerCase())
  )

  // Récupérer les villes quand une région est sélectionnée
  useEffect(() => {
    if (selectedRegion && apiRegions.length > 0) {
      console.log('Fetching cities for region:', selectedRegion)
      fetchCitiesByRegion(selectedRegion)
      // Réinitialiser la recherche quand on change de région
      setCitySearchTerm('')
    }
  }, [selectedRegion, apiRegions, fetchCitiesByRegion])

  return (
    <section className="relative h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50 overflow-hidden flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-400/15 rounded-full blur-xl animate-pulse delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl animate-bounce delay-1500"></div>
        <div className="absolute top-1/4 right-1/6 w-20 h-20 bg-yellow-400/20 rounded-full blur-lg animate-pulse delay-800"></div>
        <div className="absolute bottom-1/2 left-1/6 w-56 h-56 bg-teal-400/12 rounded-full blur-2xl animate-bounce delay-1200"></div>
        <div className="absolute top-3/4 right-1/2 w-40 h-40 bg-rose-400/18 rounded-full blur-xl animate-pulse delay-600"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-4 h-4 bg-emerald-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float delay-300">
          <div className="w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float delay-700">
          <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-32 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
          <div className="space-y-6 lg:space-y-8 animate-fadeInUp">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/50 dark:to-cyan-950/50 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4 mr-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{t.trustBadge}</span>
                <div className="relative w-5 h-5 ml-3">
                  <img
                    src="/cameroun.png"
                    alt="Drapeau du Cameroun"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-[0.9] tracking-tight">
                  <span className="block bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                    {t.title.split(' ')[0]}
                  </span>
                  <span className="block bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {t.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-light">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {t.features.map((feature, index) => {
                const IconComponent = feature.icon
                const colors = [
                  'from-emerald-500/10 to-emerald-600/5 border-emerald-200/30 text-emerald-700 dark:text-emerald-300',
                  'from-blue-500/10 to-blue-600/5 border-blue-200/30 text-blue-700 dark:text-blue-300',
                  'from-purple-500/10 to-purple-600/5 border-purple-200/30 text-purple-700 dark:text-purple-300',
                  'from-cyan-500/10 to-cyan-600/5 border-cyan-200/30 text-cyan-700 dark:text-cyan-300'
                ]
                return (
                  <div key={index} className={`group flex items-center space-x-3 p-3 lg:p-4 rounded-xl bg-gradient-to-br ${colors[index]} border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/5`}>
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:pl-8 animate-slideInRight">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-0 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-3xl overflow-hidden hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-800/50 dark:to-transparent"></div>
              <CardContent className="relative">
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25 mb-2">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">{t.searchTitle}</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400">{t.searchSubtitle}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        {t.city}
                      </label>
                      <CitySearchInput
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder={t.cityPlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-emerald-600" />
                        {t.specialty}
                      </label>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-full h-10 bg-white/50 dark:bg-slate-800/50 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 rounded-xl">
                          <SelectValue placeholder={t.specialtyPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                placeholder="Rechercher une spécialité..."
                                value={specialtySearchTerm}
                                onChange={(e) => setSpecialtySearchTerm(e.target.value)}
                                className="pl-8 h-8 text-sm"
                              />
                            </div>
                          </div>
                          <SelectItem value="all">
                            Toutes les spécialités
                          </SelectItem>
                          {filteredSpecialties.length > 0 ? (
                            filteredSpecialties.map((specialty) => (
                              <SelectItem key={specialty} value={specialty}>
                                {specialty}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              Aucune spécialité trouvée
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleSearch}
                      disabled={!selectedCity || !selectedSpecialty || isSearching}
                      className="w-full h-12 mt-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      size="lg"
                    >
                      {isSearching ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Recherche en cours...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                          {t.searchButton}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-4">
                      {[
                        { value: '150+', label: t.stats.hospitals, gradient: 'from-emerald-500 via-emerald-600 to-emerald-700', icon: '🏥' },
                        { value: '50+', label: t.stats.specialties, gradient: 'from-blue-500 via-blue-600 to-blue-700', icon: '⚕️' },
                        { value: '500+', label: t.stats.doctors, gradient: 'from-purple-500 via-purple-600 to-purple-700', icon: '👨‍⚕️' },
                        { value: '24/7', label: t.stats.available, gradient: 'from-cyan-500 via-cyan-600 to-cyan-700', icon: '🕐' }
                      ].map((stat, index) => (
                        <div key={index} className="group relative overflow-hidden">
                          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 dark:from-slate-800/40 dark:via-slate-800/30 dark:to-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                            {/* Effet de brillance au survol */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full"></div>
                            
                            {/* Icône */}
                            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                              {stat.icon}
                            </div>
                            
                            {/* Valeur */}
                            <div className={`text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-all duration-300 leading-none mb-2`}>
                              {stat.value}
                            </div>
                            
                            {/* Label */}
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300">
                              {stat.label}
                            </div>
                            
                            {/* Bordure animée */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}