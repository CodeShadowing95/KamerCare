import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

interface Appointment {
  id: number
  appointment_date: string
  reason_for_visit: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  duration_minutes: number
  notes?: string
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
}

interface UseAppointmentsReturn {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  refetch: () => void
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
        throw new Error(`HTTP error! status: ${response.status}`)
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

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  }
}

export type { Appointment }