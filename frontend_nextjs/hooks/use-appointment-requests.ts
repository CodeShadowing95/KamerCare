import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface AppointmentRequest {
  id: number
  appointment_date: string
  reason_for_visit: string
  status: 'requested' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  appointment_type: 'presentiel' | 'visio' | 'domicile' | 'urgence' | 'suivi'
  duration_minutes: number
  consultation_fee: number
  payment_status?: 'pending' | 'paid' | 'refunded'
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

interface UseAppointmentRequestsReturn {
  requests: AppointmentRequest[]
  loading: boolean
  error: string | null
  refetch: () => void
  confirmRequest: (id: number) => Promise<boolean>
  cancelRequest: (id: number, reason: string) => Promise<boolean>
  deleteRequest: (id: number) => Promise<boolean>
}

export function useAppointmentRequests(): UseAppointmentRequestsReturn {
  const [requests, setRequests] = useState<AppointmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token, user } = useAuth()

  const fetchRequests = async () => {
    if (!token || !user?.doctor?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('status', 'requested')
      params.append('doctor_id', user.doctor.id.toString())

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
        setRequests(data.data.data || [])
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des demandes')
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des demandes:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const confirmRequest = async (id: number): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}/confirm`, {
        method: 'PATCH',
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
        // Refresh the list after confirmation
        await fetchRequests()
        return true
      } else {
        throw new Error(data.message || 'Erreur lors de la confirmation')
      }
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      return false
    }
  }

  const cancelRequest = async (id: number, reason: string): Promise<boolean> => {
    if (!token) return false

    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancellation_reason: reason })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Refresh the list after cancellation
        await fetchRequests()
        return true
      } else {
        throw new Error(data.message || 'Erreur lors de l\'annulation')
      }
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      return false
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [token, user?.doctor?.id])

  const deleteRequest = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // Remove from local state
        setRequests(prev => prev.filter(request => request.id !== id))
        return true
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression')
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      return false
    }
  }

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    confirmRequest,
    cancelRequest,
    deleteRequest,
  }
}