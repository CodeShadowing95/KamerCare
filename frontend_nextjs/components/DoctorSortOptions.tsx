"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  ArrowUpDown,
  Star,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Award
} from "lucide-react"

export type SortOption =
  | 'relevance'
  | 'rating-desc'
  | 'rating-asc'
  | 'price-asc'
  | 'price-desc'
  | 'distance-asc'
  | 'availability'
  | 'experience-desc'
  | 'reviews-desc'
  | 'name-asc'
  | 'name-desc'

interface SortConfig {
  value: SortOption
  label: string
  icon: React.ReactNode
  description: string
}

interface DoctorSortOptionsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
  resultsCount?: number
  showQuickSort?: boolean
}

const sortConfigs: SortConfig[] = [
  {
    value: 'relevance',
    label: 'Pertinence',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Meilleure correspondance avec votre recherche'
  },
  {
    value: 'rating-desc',
    label: 'Note (élevée à faible)',
    icon: <Star className="w-4 h-4" />,
    description: 'Médecins les mieux notés en premier'
  },
  {
    value: 'rating-asc',
    label: 'Note (faible à élevée)',
    icon: <Star className="w-4 h-4" />,
    description: 'Médecins les moins bien notés en premier'
  },
  {
    value: 'price-asc',
    label: 'Prix (croissant)',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Prix de consultation du moins cher au plus cher'
  },
  {
    value: 'price-desc',
    label: 'Prix (décroissant)',
    icon: <DollarSign className="w-4 h-4" />,
    description: 'Prix de consultation du plus cher au moins cher'
  },
  {
    value: 'distance-asc',
    label: 'Distance',
    icon: <MapPin className="w-4 h-4" />,
    description: 'Médecins les plus proches en premier'
  },
  {
    value: 'availability',
    label: 'Disponibilité',
    icon: <Clock className="w-4 h-4" />,
    description: 'Médecins disponibles le plus tôt'
  },
  {
    value: 'experience-desc',
    label: 'Expérience',
    icon: <Award className="w-4 h-4" />,
    description: 'Médecins les plus expérimentés en premier'
  },
  {
    value: 'reviews-desc',
    label: 'Nombre d\'avis',
    icon: <Users className="w-4 h-4" />,
    description: 'Médecins avec le plus d\'avis en premier'
  },
  {
    value: 'name-asc',
    label: 'Nom (A-Z)',
    icon: <ArrowUpDown className="w-4 h-4" />,
    description: 'Ordre alphabétique croissant'
  },
  {
    value: 'name-desc',
    label: 'Nom (Z-A)',
    icon: <ArrowUpDown className="w-4 h-4" />,
    description: 'Ordre alphabétique décroissant'
  }
]

// Options de tri rapide (les plus utilisées)
const quickSortOptions: SortOption[] = [
  'relevance',
  'rating-desc',
  'price-asc',
  'distance-asc',
  'availability'
]

export default function DoctorSortOptions({
  currentSort,
  onSortChange,
  resultsCount,
  showQuickSort = true
}: DoctorSortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentConfig = sortConfigs.find(config => config.value === currentSort)

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort)
    setIsOpen(false)
  }

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Tri rapide (boutons) */}
        {showQuickSort && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Trier par:</span>
            {quickSortOptions.map(sortOption => {
              const config = sortConfigs.find(c => c.value === sortOption)!
              const isActive = currentSort === sortOption

              return (
                <Button
                  key={sortOption}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(sortOption)}
                  className={`h-8 text-xs ${isActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                    }`}
                >
                  {config.icon}
                  <span className="ml-1">{config.label}</span>
                </Button>
              )
            })}
          </div>
        )}

        {/* Menu dropdown complet */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            >
              {currentConfig?.icon}
              <span className="hidden sm:inline">{currentConfig?.label}</span>
              <span className="sm:hidden">Trier</span>
              <ArrowUpDown className="w-3 h-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Options de tri
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup
              value={currentSort}
              onValueChange={(value) => handleSortChange(value as SortOption)}
            >
              {/* Tri par pertinence */}
              <DropdownMenuRadioItem value="relevance" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Pertinence</span>
                  {currentSort === 'relevance' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Meilleure correspondance avec votre recherche
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuSeparator />

              {/* Tri par note */}
              <DropdownMenuRadioItem value="rating-desc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Note (élevée à faible)</span>
                  {currentSort === 'rating-desc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins les mieux notés en premier
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="rating-asc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <Star className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Note (faible à élevée)</span>
                  {currentSort === 'rating-asc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins les moins bien notés en premier
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuSeparator />

              {/* Tri par prix */}
              <DropdownMenuRadioItem value="price-asc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Prix (croissant)</span>
                  {currentSort === 'price-asc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Prix de consultation du moins cher au plus cher
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="price-desc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="font-medium">Prix (décroissant)</span>
                  {currentSort === 'price-desc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Prix de consultation du plus cher au moins cher
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuSeparator />

              {/* Autres options */}
              <DropdownMenuRadioItem value="distance-asc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Distance</span>
                  {currentSort === 'distance-asc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins les plus proches en premier
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="availability" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Disponibilité</span>
                  {currentSort === 'availability' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins disponibles le plus tôt
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="experience-desc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Expérience</span>
                  {currentSort === 'experience-desc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins les plus expérimentés en premier
                </p>
              </DropdownMenuRadioItem>

              <DropdownMenuRadioItem value="reviews-desc" className="flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium">Nombre d'avis</span>
                  {currentSort === 'reviews-desc' && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Actuel
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-6">
                  Médecins avec le plus d'avis en premier
                </p>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Compteur de résultats */}
      {resultsCount !== undefined && (
        <div className="text-slate-600 dark:text-slate-400">
          <span className="font-bold">{resultsCount}</span> résultat{resultsCount !== 1 ? 's' : '(s)'}
        </div>
      )}
    </div>
  )
}