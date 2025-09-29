"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Filter,
  X,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Languages,
  Calendar,
  Stethoscope,
  RotateCcw
} from "lucide-react"

export interface SearchFilters {
  specialties: string[]
  priceRange: [number, number]
  maxDistance: number
  availability: string[]
  languages: string[]
  rating: number
  consultationTypes: string[]
  experience: number
}

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearFilters: () => void
  doctorCount: number
}

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

const languages = [
  "Français",
  "Anglais",
  "Ewondo",
  "Bamiléké",
  "Fulfulde",
  "Duala",
  "Bassa"
]

const consultationTypes = [
  "Cabinet",
  "Domicile",
  "Téléconsultation",
  "Urgence"
]

const availabilityOptions = [
  "Aujourd'hui",
  "Cette semaine",
  "Ce mois-ci",
  "Disponible maintenant"
]

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  doctorCount
}: SearchFiltersProps) {
  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty]
    updateFilters({ specialties: newSpecialties })
  }

  const toggleLanguage = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language]
    updateFilters({ languages: newLanguages })
  }

  const toggleConsultationType = (type: string) => {
    const newTypes = filters.consultationTypes.includes(type)
      ? filters.consultationTypes.filter(t => t !== type)
      : [...filters.consultationTypes, type]
    updateFilters({ consultationTypes: newTypes })
  }

  const toggleAvailability = (option: string) => {
    const newAvailability = filters.availability.includes(option)
      ? filters.availability.filter(a => a !== option)
      : [...filters.availability, option]
    updateFilters({ availability: newAvailability })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.specialties.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++
    if (filters.maxDistance < 50) count++
    if (filters.availability.length > 0) count++
    if (filters.languages.length > 0) count++
    if (filters.consultationTypes.length > 0) count++
    if (filters.rating > 0) count++
    if (filters.experience > 0) count++
    return count
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white via-slate-50/30 to-slate-100/20 backdrop-blur-sm">
      <CardHeader className="pb-4 px-6 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2.5 text-slate-800">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
              <Filter className="h-4 w-4" />
            </div>
            <span className="tracking-tight">Filtres de recherche</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300 font-medium px-2.5 py-1 text-xs border-0 shadow-sm">
                {getActiveFiltersCount()} actif{getActiveFiltersCount() > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2.5">
            {/* <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600 px-2.5 py-1">
              {doctorCount} résultat{doctorCount > 1 ? 's' : ''}
            </Badge> */}
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-slate-500 hover:text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 h-8 px-3 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm font-medium">Réinitialiser</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {/* Grid Layout pour les filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Spécialités */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm">
                  <Stethoscope className="h-3.5 w-3.5" />
                </div>
                Spécialités
                {filters.specialties.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                    {filters.specialties.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                    <Checkbox
                      id={specialty}
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={() => toggleSpecialty(specialty)}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <Label
                      htmlFor={specialty}
                      className="text-xs font-medium text-slate-700 cursor-pointer flex-1 leading-tight"
                    >
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disponibilité */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-purple-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                Disponibilité
                {filters.availability.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 text-xs px-2 py-0.5">
                    {filters.availability.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50/50 transition-colors">
                    <Checkbox
                      id={option}
                      checked={filters.availability.includes(option)}
                      onCheckedChange={() => toggleAvailability(option)}
                      className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label
                      htmlFor={option}
                      className="text-xs font-medium text-slate-700 cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Langues */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                  <Languages className="h-3.5 w-3.5" />
                </div>
                Langues parlées
                {filters.languages.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                    {filters.languages.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                    <Checkbox
                      id={`language-${language}`}
                      checked={filters.languages.includes(language)}
                      onCheckedChange={() => toggleLanguage(language)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={`language-${language}`}
                      className="text-xs font-medium text-slate-700 cursor-pointer flex-1"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Types de consultation */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                Types de consultation
                {filters.consultationTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5">
                    {filters.consultationTypes.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-2">
                {consultationTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50/50 transition-colors">
                    <Checkbox
                      id={type}
                      checked={filters.consultationTypes.includes(type)}
                      onCheckedChange={() => toggleConsultationType(type)}
                      className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />
                    <Label
                      htmlFor={type}
                      className="text-xs font-medium text-slate-700 cursor-pointer flex-1"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prix */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-green-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                Gamme de prix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{filters.priceRange[0].toLocaleString()} FCFA</span>
                  <span>{filters.priceRange[1].toLocaleString()} FCFA</span>
                </div>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                  max={100000}
                  min={0}
                  step={5000}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-500 [&_[role=slider]]:to-green-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-green-500 [&_.bg-primary]:to-green-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Distance */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-orange-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                Distance maximale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-sm font-medium text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    {filters.maxDistance} km
                  </span>
                </div>
                <Slider
                  value={[filters.maxDistance]}
                  onValueChange={(value) => updateFilters({ maxDistance: value[0] })}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-orange-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-orange-500 [&_.bg-primary]:to-orange-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Note minimale */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-yellow-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm">
                  <Star className="h-3.5 w-3.5" />
                </div>
                Note minimale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>0 étoile</span>
                  <span>5 étoiles</span>
                </div>
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => updateFilters({ rating: value[0] })}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-500 [&_[role=slider]]:to-yellow-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-500 [&_.bg-primary]:to-yellow-600"
                />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-full">
                  <Star className="h-3 w-3 text-yellow-600 fill-current" />
                  <span className="text-xs font-medium text-yellow-700">
                    {filters.rating} étoile{filters.rating > 1 ? 's' : ''} et plus
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expérience */}
          <Card className="border border-slate-200/60 shadow-sm bg-gradient-to-br from-teal-50/50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                Expérience minimale
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-sm font-medium text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
                    {filters.experience} année{filters.experience > 1 ? 's' : ''}
                  </span>
                </div>
                <Slider
                  value={[filters.experience]}
                  onValueChange={(value) => updateFilters({ experience: value[0] })}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-teal-500 [&_[role=slider]]:to-teal-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-teal-500 [&_.bg-primary]:to-teal-600"
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Actions */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200/60">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full h-10 border-2 border-slate-200 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 text-slate-700 hover:text-red-700 font-medium transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer tous les filtres
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}