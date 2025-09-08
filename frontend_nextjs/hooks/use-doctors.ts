"use client"

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'

export interface Doctor {
  id: number
  first_name: string
  last_name: string
  specialization: string
  hospital?: string
  city?: string
  consultation_fee: number
  phone: string
  bio?: string
  years_of_experience: string
  is_available: boolean
  is_certified: 'Yes' | 'No'
  license_number: string
  office_address?: string
  consultation_hours?: any
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
  // Propriétés calculées pour la compatibilité
  name: string
  specialty: string
  photo: string
  rating: number
  experience: number
  consultationFee: number
  availableSlots: string[]
  email: string
  description?: string
  languages?: string[]
  education?: string
  certifications?: string[]
}

export interface SearchFilters {
  city?: string
  specialty?: string
  specialization?: string
  hospital?: string
  name?: string
  search?: string
  available?: boolean
  minRating?: number
  maxFee?: number
  availability?: 'today' | 'week' | 'month'
}

// Fonction pour transformer les données du backend en format compatible
function transformDoctorData(backendDoctor: any): Doctor {
  // Gérer les spécialités multiples (array ou string)
  const specialtyDisplay = Array.isArray(backendDoctor.specialization) 
    ? backendDoctor.specialization.join(', ') 
    : backendDoctor.specialization;
  
  const certifications = Array.isArray(backendDoctor.specialization)
    ? backendDoctor.specialization
    : [backendDoctor.specialization];

  return {
    ...backendDoctor,
    name: `Dr. ${backendDoctor.first_name} ${backendDoctor.last_name}`,
    specialty: specialtyDisplay,
    photo: '/doctor.png', // Image par défaut
    rating: 4.8, // Rating fixe pour éviter les problèmes d'hydratation
    experience: parseInt(backendDoctor.years_of_experience) || 5,
    consultationFee: backendDoctor.consultation_fee,
    availableSlots: generateAvailableSlots(), // Génération de créneaux simulés
    email: backendDoctor.user?.email || backendDoctor.email || `${backendDoctor.first_name.toLowerCase()}.${backendDoctor.last_name.toLowerCase()}@hospital.cm`,
    description: backendDoctor.bio,
    languages: ['Français', 'Anglais'],
    education: 'Université de Yaoundé I - Faculté de Médecine',
    certifications: certifications
  }
}

// Fonction pour générer des créneaux horaires simulés
function generateAvailableSlots(): string[] {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
  const slots: string[] = []
  
  // Générer des créneaux fixes pour éviter les problèmes d'hydratation
  const predefinedSlots = [
    'Lun 09:00', 'Mar 10:00', 'Mer 14:00', 'Jeu 11:00', 'Ven 15:00'
  ]
  
  return predefinedSlots
}

// Types d'erreurs spécifiques
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Erreur de connexion réseau') {
    super(message)
    this.name = 'NetworkError'
  }
}

// Fonction pour rechercher des médecins via l'API
export async function searchDoctorsAPI(filters: SearchFilters): Promise<Doctor[]> {
  try {
    const params: any = {}
    
    if (filters.city) params.city = filters.city
    if (filters.specialty || filters.specialization) {
      params.specialization = filters.specialty || filters.specialization
    }
    if (filters.name || filters.search) {
      params.search = filters.name || filters.search
    }
    if (filters.available !== undefined) params.available = filters.available
    
    const response = await apiService.getDoctors(params)
    
    if (response.success && response.data?.data) {
      return response.data.data.map(transformDoctorData)
    }
    
    // Si l'API retourne success: false
    if (!response.success) {
      throw new ApiError(response.message || 'Erreur lors de la récupération des médecins')
    }
    
    return []
  } catch (error) {
    console.error('Erreur lors de la recherche de médecins:', error)
    
    // Gestion spécifique des erreurs réseau
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.')
    }
    
    // Gestion des erreurs HTTP
    if (error instanceof Response) {
      if (error.status === 404) {
        throw new ApiError('Service de recherche de médecins non disponible', 404)
      }
      if (error.status === 500) {
        throw new ApiError('Erreur interne du serveur. Veuillez réessayer plus tard.', 500)
      }
      if (error.status >= 400) {
        throw new ApiError(`Erreur du serveur (${error.status})`, error.status)
      }
    }
    
    // Si c'est déjà une erreur personnalisée, la relancer
    if (error instanceof ApiError || error instanceof NetworkError) {
      throw error
    }
    
    // Erreur générique
    throw new ApiError('Une erreur inattendue s\'est produite lors de la recherche des médecins')
  }
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<string[]>([])

  // Fonction pour rechercher des médecins
  const searchDoctors = useCallback(async (filters: SearchFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const results = await searchDoctorsAPI(filters)
      
      // Appliquer les filtres côté client pour les propriétés non supportées par l'API
      let filteredDoctors = [...results]
      
      // Filtrer par note minimale
      if (filters.minRating) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.rating >= filters.minRating!
        )
      }
      
      // Filtrer par tarif maximum
      if (filters.maxFee) {
        filteredDoctors = filteredDoctors.filter(doctor => 
          doctor.consultationFee <= filters.maxFee!
        )
      }
      
      // Trier par note (décroissant) puis par expérience (décroissant)
      filteredDoctors.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.experience - a.experience
      })
      
      setDoctors(filteredDoctors)
    } catch (err) {
      let errorMessage = 'Erreur lors de la recherche des médecins'
      
      if (err instanceof NetworkError) {
        errorMessage = err.message
      } else if (err instanceof ApiError) {
        errorMessage = err.message
        if (err.statusCode === 404) {
          errorMessage = 'Service de recherche temporairement indisponible'
        } else if (err.statusCode === 500) {
          errorMessage = 'Problème technique du serveur. Veuillez réessayer dans quelques minutes.'
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setDoctors([])
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Fonction pour obtenir un médecin par ID
  const getDoctorById = useCallback((id: string | number): Doctor | undefined => {
    return doctors.find(doctor => doctor.id.toString() === id.toString())
  }, [doctors])
  
  // Fonction pour charger les spécialités depuis l'API
  const loadSpecialties = useCallback(async () => {
    try {
      const response = await apiService.getSpecializations()
      if (response.success && response.data) {
        setSpecialties(response.data)
      } else {
        console.warn('Impossible de charger les spécialités depuis l\'API')
        // Fallback avec des spécialités par défaut
        setSpecialties([
          'Cardiologie',
          'Dermatologie', 
          'Gynécologie',
          'Pédiatrie',
          'Médecine générale',
          'Neurologie',
          'Orthopédie',
          'Psychiatrie'
        ])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error)
      // En cas d'erreur, utiliser des spécialités par défaut
      setSpecialties([
        'Cardiologie',
        'Dermatologie', 
        'Gynécologie',
        'Pédiatrie',
        'Médecine générale',
        'Neurologie',
        'Orthopédie',
        'Psychiatrie'
      ])
    }
  }, [])
  
  // Fonction pour obtenir les spécialités disponibles
  const getAvailableSpecialties = useCallback((): string[] => {
    return specialties
  }, [specialties])
  
  // Fonction pour obtenir les villes disponibles
  const getAvailableCities = useCallback((): string[] => {
    const cities = [...new Set(doctors.map(doctor => doctor.city).filter(Boolean))] as string[]
    return cities.sort()
  }, [doctors])
  
  // Fonction pour obtenir les hôpitaux disponibles
  const getAvailableHospitals = useCallback((): string[] => {
    const hospitals = [...new Set(doctors.map(doctor => doctor.hospital).filter(Boolean))] as string[]
    return hospitals.sort()
  }, [doctors])
  
  return {
    doctors,
    loading,
    error,
    searchDoctors,
    getDoctorById,
    getAvailableSpecialties,
    getAvailableCities,
    getAvailableHospitals,
    loadSpecialties
  }
}

// Hook pour gérer les rendez-vous
export function useAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const bookAppointment = async (doctorId: string, slot: string, patientInfo: any) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newAppointment = {
        id: `appointment_${doctorId}_${slot.replace(/\s+/g, '_')}_${appointments.length + 1}`,
        doctorId,
        slot,
        patientInfo,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      
      setAppointments(prev => [...prev, newAppointment])
      return newAppointment
    } catch (err) {
      setError('Erreur lors de la prise de rendez-vous')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return {
    appointments,
    loading,
    error,
    bookAppointment
  }
}