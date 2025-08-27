import { useState, useEffect, useCallback } from 'react'
import { villesParRegion } from '@/constants/index'

interface City {
  city: string
  lat: number
  lng: number
}

interface Region {
  name: string
  cities_count: number
}

export const useCities = () => {
  const [regionsList, setRegionsList] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [searchResults, setSearchResults] = useState<City[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer toutes les régions depuis les données locales
  const fetchRegions = useCallback(() => {
    setLoading(true)
    setError(null)
    try {
      const regions: Region[] = Object.keys(villesParRegion).map(regionName => ({
        name: regionName,
        cities_count: villesParRegion[regionName as keyof typeof villesParRegion].length
      }))
      setRegionsList(regions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }, [])

  // Récupérer les villes d'une région spécifique depuis les données locales
  const fetchCitiesByRegion = useCallback((regionName: string) => {
    console.log('Starting fetchCitiesByRegion for:', regionName)
    setLoading(true)
    setError(null)
    try {
      const regionCities = villesParRegion[regionName as keyof typeof villesParRegion]
      if (regionCities) {
        setCities(regionCities)
        console.log('Cities set:', regionCities.length, 'cities')
      } else {
        setCities([])
        console.log('No cities found for region:', regionName)
      }
    } catch (err) {
      console.error('Error in fetchCitiesByRegion:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }, [])

  // Rechercher des villes par nom dans les données locales
  const searchCities = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const allCities: City[] = []
      // Parcourir toutes les régions pour collecter toutes les villes
      Object.values(villesParRegion).forEach(regionCities => {
        allCities.push(...regionCities)
      })
      
      // Filtrer les villes selon le terme de recherche
      const filteredCities = allCities.filter(city => 
        city.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      setSearchResults(filteredCities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }, [])

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