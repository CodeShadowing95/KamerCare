"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  X, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope,
  TrendingUp,
  History
} from "lucide-react"
import { Doctor } from "@/types/doctor"

interface SmartSearchBarProps {
  value: string
  onChange: (value: string) => void
  doctors: Doctor[]
  onDoctorSelect?: (doctor: Doctor) => void
  placeholder?: string
}

interface SearchSuggestion {
  type: 'doctor' | 'specialty' | 'city' | 'recent' | 'trending'
  value: string
  label: string
  icon: React.ReactNode
  doctor?: Doctor
}

export default function SmartSearchBar({ 
  value, 
  onChange, 
  doctors, 
  onDoctorSelect,
  placeholder = "Rechercher par nom, spécialité, ville..."
}: SmartSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Charger les recherches récentes depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kamercare-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Erreur lors du chargement des recherches récentes:', error)
      }
    }
  }, [])

  // Sauvegarder les recherches récentes
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return
    
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('kamercare-recent-searches', JSON.stringify(updated))
  }

  // Générer les suggestions
  useEffect(() => {
    if (!value.trim()) {
      // Suggestions par défaut (recherches récentes + tendances)
      const defaultSuggestions: SearchSuggestion[] = [
        ...recentSearches.slice(0, 3).map(search => ({
          type: 'recent' as const,
          value: search,
          label: search,
          icon: <History className="w-4 h-4 text-slate-400" />
        })),
        {
          type: 'trending',
          value: 'Cardiologie',
          label: 'Cardiologie',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        },
        {
          type: 'trending',
          value: 'Pédiatrie',
          label: 'Pédiatrie',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        },
        {
          type: 'trending',
          value: 'Yaoundé',
          label: 'Yaoundé',
          icon: <TrendingUp className="w-4 h-4 text-orange-500" />
        }
      ]
      setSuggestions(defaultSuggestions)
      return
    }

    const query = value.toLowerCase().trim()
    const newSuggestions: SearchSuggestion[] = []

    // Suggestions de médecins
    const matchingDoctors = doctors
      .filter(doctor => 
        doctor.name?.toLowerCase().includes(query) ||
        `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(query)
      )
      .slice(0, 3)

    matchingDoctors.forEach(doctor => {
      newSuggestions.push({
        type: 'doctor',
        value: doctor.name || `${doctor.first_name} ${doctor.last_name}`,
        label: doctor.name || `${doctor.first_name} ${doctor.last_name}`,
        icon: <User className="w-4 h-4 text-blue-500" />,
        doctor
      })
    })

    // Suggestions de spécialités
    const specialties = [...new Set(doctors.map(d => d.specialty).filter(Boolean))]
    const matchingSpecialties = specialties
      .filter(specialty => specialty?.toLowerCase().includes(query))
      .slice(0, 3)

    matchingSpecialties.forEach(specialty => {
      newSuggestions.push({
        type: 'specialty',
        value: specialty!,
        label: specialty!,
        icon: <Stethoscope className="w-4 h-4 text-green-500" />
      })
    })

    // Suggestions de villes
    const cities = [...new Set(doctors.map(d => d.city || d.location?.split(',')[0]).filter(Boolean))]
    const matchingCities = cities
      .filter(city => city?.toLowerCase().includes(query))
      .slice(0, 3)

    matchingCities.forEach(city => {
      newSuggestions.push({
        type: 'city',
        value: city!,
        label: city!,
        icon: <MapPin className="w-4 h-4 text-red-500" />
      })
    })

    setSuggestions(newSuggestions.slice(0, 8))
  }, [value, doctors, recentSearches])

  // Gestion du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex])
        } else if (value.trim()) {
          saveRecentSearch(value)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Sélection d'une suggestion
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.value)
    saveRecentSearch(suggestion.value)
    setIsOpen(false)
    setSelectedIndex(-1)
    
    if (suggestion.doctor && onDoctorSelect) {
      onDoctorSelect(suggestion.doctor)
    }
  }

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const clearSearch = () => {
    onChange('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('kamercare-recent-searches')
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-12 text-sm border-slate-200 dark:border-slate-700 focus:border-emerald-300 dark:focus:border-emerald-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {/* En-tête si recherches récentes */}
              {!value.trim() && recentSearches.length > 0 && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Recherches récentes
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="h-6 px-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Effacer
                  </Button>
                </div>
              )}

              {/* Liste des suggestions */}
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.value}`}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  {suggestion.icon}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {suggestion.label}
                    </div>
                    {suggestion.doctor && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {suggestion.doctor.specialty} • {suggestion.doctor.location || suggestion.doctor.city}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs capitalize"
                  >
                    {suggestion.type === 'doctor' ? 'Médecin' :
                     suggestion.type === 'specialty' ? 'Spécialité' :
                     suggestion.type === 'city' ? 'Ville' :
                     suggestion.type === 'recent' ? 'Récent' : 'Tendance'}
                  </Badge>
                </div>
              ))}

              {/* Message si aucune suggestion */}
              {value.trim() && suggestions.length === 0 && (
                <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune suggestion trouvée</p>
                  <p className="text-xs mt-1">Essayez un autre terme de recherche</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}