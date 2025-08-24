"use client"

import { useEffect, useState } from "react"
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
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCities } from "@/hooks/use-cities"

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
      title: "Votre santé, notre priorité",
      subtitle: "Prenez rendez-vous facilement dans les hôpitaux publics du Cameroun",
      searchTitle: "Trouvez votre rendez-vous médical",
      searchSubtitle: "Sélectionnez vos critères de recherche",
      region: "Région",
      city: "Ville",
      hospital: "Hôpital",
      specialty: "Spécialité médicale",
      searchButton: "Rechercher des créneaux disponibles",
      regionPlaceholder: "Sélectionnez votre région",
      cityPlaceholder: "Choisissez une ville",
      hospitalPlaceholder: "Sélectionnez un hôpital",
      specialtyPlaceholder: "Choisissez une spécialité",
      stats: {
        hospitals: "Hôpitaux",
        specialties: "Spécialités",
        available: "Disponible"
      },
      features: [
        { text: "Gratuit et sécurisé", icon: Shield },
        { text: "Confirmation instantanée", icon: CheckCircle },
        { text: "Support 24/7", icon: Clock }
      ],
      trustBadge: "Plateforme officielle du Ministère de la Santé"
    },
    en: {
      title: "Your health, our priority",
      subtitle: "Easily book appointments in Cameroon's public hospitals",
      searchTitle: "Find your medical appointment",
      searchSubtitle: "Select your search criteria",
      region: "Region",
      city: "City",
      hospital: "Hospital",
      specialty: "Medical specialty",
      searchButton: "Search available slots",
      regionPlaceholder: "Select your region",
      cityPlaceholder: "Choose a city",
      hospitalPlaceholder: "Select a hospital",
      specialtyPlaceholder: "Choose a specialty",
      stats: {
        hospitals: "Hospitals",
        specialties: "Specialties",
        available: "Available"
      },
      features: [
        { text: "Free and secure", icon: Shield },
        { text: "Instant confirmation", icon: CheckCircle },
        { text: "24/7 Support", icon: Clock }
      ],
      trustBadge: "Official platform of the Ministry of Health"
    }
  }

  const t = texts[language]

  const { regionsList: apiRegions, cities: apiCities, fetchCitiesByRegion, loading, error } = useCities()
  
  // État pour la recherche de ville
  const [citySearchTerm, setCitySearchTerm] = useState('')
  
  // État pour la recherche de spécialité
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState('')
  
  // Liste exhaustive des spécialités médicales
  const medicalSpecialties = [
    // Médecine Générale
    'Médecine Générale',
    
    // Spécialités chirurgicales et interventionnelles
    'Anesthésie/Réanimation',
    'Chirurgie générale',
    'Chirurgie pédiatrique',
    'Gynécologie/Obstétrique',
    'Ophthalmologie',
    'Oto-rhino-laryngologie (ORL)',
    
    // Spécialités médicales internes
    'Cardiologie',
    'Dermatologie/Vénérologie',
    'Endocrinologie/Diabétologie',
    'Gastroentérologie/Hépatologie',
    'Hématologie clinique',
    'Maladies infectieuses',
    'Médecine interne',
    'Néphrologie',
    'Neurologie',
    'Oncologie médicale',
    'Pédiatrie',
    'Psychiatrie',
    
    // Spécialités de biologie et diagnostic
    'Anatomopathologie',
    'Biochimie médicale',
    'Biologie clinique',
    'Radiologie et imagerie médicale',
    
    // Spécialités transversales
    'Santé publique'
  ]
  
  // Filtrer les villes selon le terme de recherche
  const filteredCities = apiCities.filter(city => 
    city.city.toLowerCase().includes(citySearchTerm.toLowerCase())
  )
  
  // Filtrer les spécialités selon le terme de recherche
  const filteredSpecialties = medicalSpecialties.filter(specialty => 
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
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        
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

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col justify-center min-h-screen py-20">
          {/* Trust badge */}
          <div className="text-center mb-8">
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-4 py-2 text-sm font-medium border border-emerald-200 dark:border-emerald-700">
              <Shield className="w-4 h-4 mr-2" />
              {t.trustBadge}
            </Badge>
          </div>

          {/* Main content */}
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {t.features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
                    <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Search form */}
          <div className="max-w-6xl mx-auto w-full">
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                {/* Search Header */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{t.searchTitle}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">{t.searchSubtitle}</p>
                </div>

                {/* Main Search Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
                        {t.region}
                      </label>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-200 rounded-xl text-base">
                          <SelectValue placeholder={t.regionPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {apiRegions.map((region) => (
                            <SelectItem key={region.name} value={region.name}>
                              {region.name} ({region.cities_count} villes)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        {t.city}
                      </label>
                      <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedRegion || loading}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 rounded-xl text-base disabled:opacity-50">
                          <SelectValue placeholder={loading ? "Chargement des villes..." : t.cityPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRegion && !error && (
                             <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-2 border-b shadow-sm">
                               <div className="relative">
                                 <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                 <Input
                                   placeholder="Rechercher une ville..."
                                   value={citySearchTerm}
                                   onChange={(e) => setCitySearchTerm(e.target.value)}
                                   className="pl-8 h-8 text-sm"
                                   onClick={(e) => e.stopPropagation()}
                                 />
                               </div>
                             </div>
                           )}
                          {error && (
                            <div className="p-2 text-red-500 text-sm">
                              Erreur: {error}
                            </div>
                          )}
                          {selectedRegion && !error && filteredCities.map((city: { city: string }, index: number) => (
                            <SelectItem key={index} value={city.city}>
                              {city.city}
                            </SelectItem>
                          ))}
                          {selectedRegion && !loading && !error && filteredCities.length === 0 && apiCities.length > 0 && (
                             <div className="p-2 text-gray-500 text-sm">
                               Aucune ville trouvée pour "{citySearchTerm}"
                             </div>
                           )}
                          {selectedRegion && !loading && !error && apiCities.length === 0 && (
                            <div className="p-2 text-gray-500 text-sm">
                              Aucune ville trouvée pour cette région
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-600" />
                        {t.hospital}
                      </label>
                      <Select value={selectedHospital} onValueChange={setSelectedHospital} disabled={!selectedCity}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500 transition-all duration-200 rounded-xl text-base disabled:opacity-50">
                          <SelectValue placeholder={t.hospitalPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {hospitals
                            .filter((h) => h.city === selectedCity)
                            .map((hospital) => (
                              <SelectItem key={hospital.id} value={hospital.id.toString()}>
                                {hospital.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        {t.specialty}
                      </label>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 rounded-xl text-base">
                          <SelectValue placeholder={t.specialtyPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-2 border-b shadow-sm">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                placeholder="Rechercher une spécialité..."
                                value={specialtySearchTerm}
                                onChange={(e) => setSpecialtySearchTerm(e.target.value)}
                                className="pl-8 h-8 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          {filteredSpecialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                          {filteredSpecialties.length === 0 && specialtySearchTerm && (
                            <div className="p-2 text-gray-500 text-sm">
                              Aucune spécialité trouvée pour "{specialtySearchTerm}"
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="w-full h-16 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
                    >
                      <Search className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                      {t.searchButton}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">150+</div>
                      <div className="text-sm text-muted-foreground font-medium">{t.stats.hospitals}</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">50+</div>
                      <div className="text-sm text-muted-foreground font-medium">{t.stats.specialties}</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">24/7</div>
                      <div className="text-sm text-muted-foreground font-medium">{t.stats.available}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}