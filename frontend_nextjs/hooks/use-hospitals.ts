import { useState, useCallback, useEffect } from 'react'
import { apiService } from '../lib/api'

export interface Hospital {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone?: string
  email?: string
  type?: 'public' | 'private'
  photo?: string
}

interface UseHospitalsReturn {
  hospitals: Hospital[]
  loading: boolean
  error: string | null
  searchHospitals: (searchTerm?: string, ville?: string) => Promise<void>
  refreshHospitals: () => Promise<void>
  getHospitalById: (id: string | number) => Hospital | undefined
  clearError: () => void
}

export function useHospitals(): UseHospitalsReturn {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchHospitals = useCallback(async (searchTerm?: string, ville?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const params: any = {}
      
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      
      if (ville && ville.trim()) {
        params.ville = ville.trim()
      }
      
      // Récupérer tous les hôpitaux (pagination élevée)
      params.per_page = 1000
      
      const response = await apiService.getHospitals(params)
      
      if (response.success && response.data?.data) {
        setHospitals(response.data.data)
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des hôpitaux')
      }
    } catch (err) {
      console.error('Erreur lors de la recherche d\'hôpitaux:', err)
      
      let errorMessage = 'Erreur lors de la recherche des hôpitaux'
      
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      
      // Données de démonstration en cas d'erreur
      setHospitals([
        {
          id: 1,
          nom: 'Hôpital Central de Yaoundé',
          adresse: 'Avenue Kennedy',
          ville: 'Yaoundé',
          telephone: '+237 222 23 40 29',
          email: 'contact@hcy.cm',
          type: 'public'
        },
        {
          id: 2,
          nom: 'Clinique des Spécialités',
          adresse: 'Rue de la Réunification',
          ville: 'Douala',
          telephone: '+237 233 42 15 67',
          email: 'info@clinique-specialites.cm',
          type: 'private'
        },
        {
          id: 3,
          nom: 'Hôpital Général de Douala',
          adresse: 'Boulevard de la Liberté',
          ville: 'Douala',
          telephone: '+237 233 42 89 12',
          email: 'contact@hgd.cm',
          type: 'public'
        },
        {
          id: 4,
          nom: 'Centre Médical International',
          adresse: 'Quartier Bastos',
          ville: 'Yaoundé',
          telephone: '+237 222 20 15 30',
          email: 'contact@cmi.cm',
          type: 'private'
        },
        {
          id: 5,
          nom: 'Hôpital Régional de Bafoussam',
          adresse: 'Route de Bamenda',
          ville: 'Bafoussam',
          telephone: '+237 233 44 20 15',
          email: 'contact@hrb.cm',
          type: 'public'
        },
        {
          id: 6,
          nom: 'Polyclinique du Littoral',
          adresse: 'Akwa Nord',
          ville: 'Douala',
          telephone: '+237 233 43 67 89',
          email: 'info@polyclinique-littoral.cm',
          type: 'private'
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshHospitals = useCallback(async () => {
    await searchHospitals()
  }, [searchHospitals])

  const getHospitalById = useCallback((id: string | number): Hospital | undefined => {
    return hospitals.find(hospital => hospital.id.toString() === id.toString())
  }, [hospitals])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Charger les hôpitaux au montage du composant
  useEffect(() => {
    searchHospitals()
  }, [searchHospitals])

  return {
    hospitals,
    loading,
    error,
    searchHospitals,
    refreshHospitals,
    getHospitalById,
    clearError
  }
}

// Hook pour la recherche d'hôpitaux avec debounce
export function useHospitalSearch(initialSearchTerm: string = '', debounceMs: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm)
  const { hospitals, loading, error, searchHospitals, clearError } = useHospitals()

  // Debounce du terme de recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  // Effectuer la recherche quand le terme débounced change
  useEffect(() => {
    searchHospitals(debouncedSearchTerm)
  }, [debouncedSearchTerm, searchHospitals])

  return {
    searchTerm,
    setSearchTerm,
    hospitals,
    loading,
    error,
    clearError
  }
}