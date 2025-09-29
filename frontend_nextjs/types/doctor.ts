// Types auxiliaires pour les médecins
export interface ConsultationHours {
  [day: string]: {
    start: string
    end: string
    isAvailable: boolean
  }
}

export interface DoctorAvailability {
  today: boolean
  thisWeek: boolean
  thisMonth: boolean
  nextAvailable: string | null
}

export interface DoctorLocation {
  address: string
  city: string
  region?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface DoctorQualification {
  degree: string
  institution: string
  year: number
  country?: string
}

export interface DoctorReview {
  id: number
  patient_name: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface DoctorUser {
  id: number
  name: string
  email: string
  role: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

// Interface principale Doctor
export interface Doctor {
  // Propriétés de base issues de la base de données
  id: number
  user_id: number
  first_name: string
  last_name: string
  specialization: string
  license_number: string
  phone?: string
  bio?: string
  qualifications?: DoctorQualification[] | string // JSON ou array
  years_of_experience: string
  office_address?: string
  consultation_hours?: ConsultationHours | string // JSON ou object
  consultation_fee?: number
  is_available: boolean

  // Propriétés calculées et dérivées pour le frontend
  name: string // Nom complet calculé
  specialty: string // Alias pour specialization
  rating: number // Note moyenne calculée
  reviews_count: number // Nombre d'avis
  likes_count?: number // Nombre de likes
  experience: number // Années d'expérience en nombre
  consultationFee: number // Alias pour consultation_fee
  location?: string // Localisation formatée
  city?: string // Ville extraite de l'adresse
  region?: string // Région
  country?: string // Pays (par défaut Cameroun)
  
  // Propriétés pour l'interface utilisateur
  photo?: string // URL de la photo de profil
  avatar?: string // Alias pour photo
  email?: string // Email du médecin
  description?: string // Description courte
  languages?: string[] // Langues parlées
  education?: string // Formation principale
  certifications?: string[] // Certifications
  hospital?: string // Hôpital principal
  
  // Propriétés de disponibilité
  availableSlots?: string[] // Créneaux disponibles
  availability?: DoctorAvailability // Disponibilité détaillée
  nextAvailableSlot?: string // Prochain créneau disponible
  isOnline?: boolean // En ligne pour téléconsultation
  
  // Propriétés de géolocalisation
  coordinates?: {
    lat: number
    lng: number
  }
  distance?: number // Distance par rapport à l'utilisateur
  
  // Propriétés de consultation
  consultationTypes?: ('cabinet' | 'domicile' | 'teleconsultation' | 'urgence')[]
  acceptsInsurance?: boolean // Accepte les assurances
  acceptsEmergency?: boolean // Accepte les urgences
  
  // Propriétés de certification et vérification
  is_certified?: 'Yes' | 'No' | boolean
  is_verified?: boolean // Profil vérifié
  verification_status?: 'pending' | 'verified' | 'rejected'
  
  // Relations avec d'autres entités
  user?: DoctorUser // Informations utilisateur
  reviews?: DoctorReview[] // Avis des patients
  
  // Métadonnées
  created_at?: string
  updated_at?: string
  last_active?: string // Dernière activité
  profile_completion?: number // Pourcentage de complétion du profil
  
  // Propriétés pour les statistiques
  total_appointments?: number // Nombre total de rendez-vous
  completed_appointments?: number // Rendez-vous terminés
  success_rate?: number // Taux de réussite
  response_time?: number // Temps de réponse moyen (en minutes)
  
  // Propriétés pour les filtres et recherche
  tags?: string[] // Tags pour la recherche
  keywords?: string[] // Mots-clés
  search_score?: number // Score de pertinence pour la recherche
}

// Types pour les filtres de recherche
export interface DoctorSearchFilters {
  city?: string
  specialty?: string
  specialization?: string
  hospital?: string
  name?: string
  search?: string
  available?: boolean
  minRating?: number
  maxFee?: number
  minExperience?: number
  languages?: string[]
  consultationTypes?: string[]
  acceptsInsurance?: boolean
  isOnline?: boolean
  distance?: number
  availability?: 'today' | 'week' | 'month'
  priceRange?: [number, number]
  sortBy?: 'rating' | 'price' | 'distance' | 'experience' | 'availability'
  sortOrder?: 'asc' | 'desc'
}

// Types pour les options de tri
export type DoctorSortOption = 
  | 'relevance' 
  | 'rating' 
  | 'price' 
  | 'distance' 
  | 'experience' 
  | 'availability' 
  | 'reviews' 
  | 'name'

// Type pour les statistiques des médecins
export interface DoctorStats {
  total: number
  available: number
  averageRating: number
  averagePrice: number
  averageExperience: number
  topSpecialties: Array<{
    specialty: string
    count: number
    percentage: number
  }>
  topCities: Array<{
    city: string
    count: number
    percentage: number
  }>
  priceRanges: Array<{
    range: string
    count: number
    percentage: number
  }>
}

// Export du type principal pour compatibilité
export default Doctor