import { useState } from 'react'
import { useAuth } from './use-auth'
import { apiService } from '@/lib/api'

interface CreateAppointmentData {
  doctor_id: number
  appointment_date: string // Format: YYYY-MM-DD HH:mm:ss
  appointment_type: 'presentiel' | 'visio' | 'domicile' | 'urgence' | 'suivi'
  reason_for_visit: string
  duration_minutes?: number
  notes?: string
  consultation_fee: number
}

interface CreateAppointmentResponse {
  success: boolean
  data?: any
  message: string
}

interface UseCreateAppointmentReturn {
  createAppointment: (data: CreateAppointmentData) => Promise<CreateAppointmentResponse>
  loading: boolean
  error: string | null
  clearError: () => void
}

export function useCreateAppointment(): UseCreateAppointmentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, user } = useAuth()

  const createAppointment = async (appointmentData: CreateAppointmentData): Promise<CreateAppointmentResponse> => {
    if (!token || !user) {
      const errorMsg = 'Vous devez être connecté pour créer un rendez-vous'
      setError(errorMsg)
      return { success: false, message: errorMsg }
    }

    if (user.role !== 'patient') {
      const errorMsg = 'Seuls les patients peuvent créer des demandes de rendez-vous'
      setError(errorMsg)
      return { success: false, message: errorMsg }
    }

    setLoading(true)
    setError(null)

    try {
      // Préparer les données pour l'API
      const requestData = {
        patient_id: user.id, // ID de l'utilisateur patient connecté
        doctor_id: appointmentData.doctor_id,
        appointment_date: appointmentData.appointment_date,
        appointment_type: appointmentData.appointment_type,
        reason_for_visit: appointmentData.reason_for_visit,
        duration_minutes: appointmentData.duration_minutes || 30,
        notes: appointmentData.notes || '',
        consultation_fee: appointmentData.consultation_fee,
        status: 'scheduled', // Statut initial pour une demande
        created_by_user_id: user.id
      }

      const responseData = await apiService.createAppointment(requestData, token)

      if (responseData.success) {
        return {
          success: true,
          data: responseData.data,
          message: responseData.message || 'Demande de rendez-vous créée avec succès'
        }
      } else {
        throw new Error(responseData.message || 'Erreur lors de la création de la demande')
      }
    } catch (err) {
      console.error('Erreur lors de la création du rendez-vous:', err)
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    createAppointment,
    loading,
    error,
    clearError
  }
}

export type { CreateAppointmentData, CreateAppointmentResponse }