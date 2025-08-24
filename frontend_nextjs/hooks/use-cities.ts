import { useState, useEffect, useCallback } from 'react'

interface City {
  city: string
  lat: number
  lng: number
}

interface Region {
  name: string
  cities_count: number
}

interface RegionsResponse {
  success: boolean
  message: string
  data: {
    regions_count: number
    regions: Region[]
  }
}

interface CitiesResponse {
  success: boolean
  message: string
  data: {
    region: string
    cities_count: number
    cities: City[]
  }
}

interface SearchResponse {
  success: boolean
  message: string
  data: {
    search_term: string
    cities_found: number
    cities: City[]
  }
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/cities'

export const useCities = () => {
  const [regionsList, setRegionsList] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [searchResults, setSearchResults] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer toutes les régions
  const fetchRegions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/regions`)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des régions')
      }
      const data: RegionsResponse = await response.json()
      if (data.success) {
        setRegionsList(data.data.regions)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les villes d'une région spécifique
  const fetchCitiesByRegion = useCallback(async (regionName: string) => {
    console.log('Starting fetchCitiesByRegion for:', regionName)
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/by-region?region=${encodeURIComponent(regionName)}`)
      console.log('Response status:', response.status)
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des villes')
      }
      const data: CitiesResponse = await response.json()
      console.log('API Response:', data)
      if (data.success) {
        setCities(data.data.cities)
        console.log('Cities set:', data.data.cities.length, 'cities')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      console.error('Error in fetchCitiesByRegion:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }, [])

  // Rechercher des villes par nom
  const searchCities = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/search?search=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
      }
      const data: SearchResponse = await response.json()
      if (data.success) {
        setSearchResults(data.data.cities)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // Charger les régions au montage du composant
  useEffect(() => {
    fetchRegions()
  }, [])

  return {
    // États
    regionsList,
    cities,
    searchResults,
    loading,
    error,
    
    // Actions
    fetchRegions,
    fetchCitiesByRegion,
    searchCities,
    
    // Utilitaires
    clearError: () => setError(null),
    clearCities: () => setCities([]),
    clearSearchResults: () => setSearchResults([])
  }
}

export default useCities