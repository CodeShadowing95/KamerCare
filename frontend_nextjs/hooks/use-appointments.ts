import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

interface Appointment {
  id: number
  appointment_date: string
  reason_for_visit: string
  status: 'requested' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'expired'
  appointment_type: 'presentiel' | 'visio' | 'domicile' | 'urgence' | 'suivi'
  location?: string
  duration_minutes: number
  notes?: string
  payment_status?: 'paid' | 'refunded' | 'pending' | 'unpaid'
  consultation_fee?: number
  patient: {
    id: number
    first_name: string
    last_name: string
    phone?: string
    email?: string
  }
  doctor: {
    id: number
    first_name: string
    last_name: string
    specialization: string
  }
  created_by?: {
    id: number
    first_name: string
    last_name: string
    role: 'patient' | 'doctor' | 'admin'
  }
}

interface UseAppointmentsReturn {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  refetch: () => void
  deleteAppointment: (id: number) => Promise<boolean>
}

export function useAppointments(filters?: {
  status?: string
  upcoming?: boolean
  today?: boolean
  doctor_id?: number
}): UseAppointmentsReturn {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchAppointments = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.upcoming) params.append('upcoming', 'true')
      if (filters?.today) params.append('today', 'true')
      if (filters?.doctor_id) params.append('doctor_id', filters.doctor_id.toString())

      const response = await fetch(`http://localhost:8000/api/appointments?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setAppointments(data.data.data || [])
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des rendez-vous')
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [token, filters?.status, filters?.upcoming, filters?.today, filters?.doctor_id])

  const deleteAppointment = async (id: number): Promise<boolean> => {
    if (!token) {
      setError('Token d\'authentification manquant')
      return false
    }

    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Mettre à jour la liste locale en supprimant le rendez-vous
        setAppointments(prev => prev.filter(appointment => appointment.id !== id))
        return true
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression du rendez-vous')
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression')
      return false
    }
  }

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    deleteAppointment,
  }
}

export type { Appointment }