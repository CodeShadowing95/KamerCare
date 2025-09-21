"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'
import { apiService } from '@/lib/api'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  status: string
  hospital: string
  certified: boolean
  last_login?: string
  created_at: string
  avatar: string
}

export interface UsersFilters {
  search?: string
  role?: string
  status?: string
  sort_by?: string
  sort_order?: string
  per_page?: number
  page?: number
}

export interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  } | null
  fetchUsers: (filters?: UsersFilters) => Promise<void>
  refreshUsers: () => Promise<void>
  toggleCertification: (userId: number) => Promise<{
    success: boolean;
    data?: {
      user_id: number;
      doctor_id: number;
      previous_status: string;
      new_status: string;
      certified: boolean;
    };
    message: string;
  }>
}

export function useUsers(initialFilters?: UsersFilters): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{
    current_page: number
    last_page: number
    per_page: number
    total: number
  } | null>(null)
  const { token, user, isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchUsers = async (filters?: UsersFilters) => {
    // Attendre que l'authentification soit vérifiée
    if (authLoading) {
      return
    }
    
    if (!isAuthenticated || !token) {
      setLoading(false)
      setError('Vous devez être connecté pour accéder à cette fonctionnalité.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Utilisateur connecté:', user)
      console.log('🔑 Token:', token ? 'Présent' : 'Absent')

      const response = await apiService.getAllUsers(filters, token)
      
      if (response.success) {
        setUsers(response.data.data || [])
        setPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        })
      } else {
        throw new Error(response.message || 'Erreur lors de la récupération des utilisateurs')
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', err)
      setError(err.message || 'Erreur lors de la récupération des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const refreshUsers = async () => {
    await fetchUsers(initialFilters)
  }

  const toggleCertification = async (userId: number) => {
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    try {
      const response = await apiService.toggleDoctorCertification(userId, token)
      
      if (response.success) {
        // Update the user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, certified: response.data?.certified || false }
              : user
          )
        )
        return response
      } else {
        throw new Error(response.message || 'Erreur lors de la modification de la certification')
      }
    } catch (err: any) {
      console.error('Erreur lors de la modification de la certification:', err)
      throw err
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated && token) {
      fetchUsers(initialFilters)
    }
  }, [token, user, isAuthenticated, authLoading])

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    refreshUsers,
    toggleCertification
  }
}