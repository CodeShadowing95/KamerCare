'use client'

import { useState, useEffect } from 'react'
import { Bell, Calendar, Clock, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'

interface Appointment {
  id: number
  appointment_date: string
  reason_for_visit: string
  appointment_type: string
  doctor: {
    name: string
    specialization?: string
  }
  status: string
}

export default function NotificationsDropdown() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Récupérer les rendez-vous du patient
  const fetchAppointments = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch('http://localhost:8000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.success) {
          // La structure de la réponse est data.data.data à cause de la pagination
          const appointmentsList = data.data.data || []
          
          // Filtrer les rendez-vous à venir
          const upcomingAppointments = appointmentsList.filter((apt: Appointment) => {
            const appointmentDate = new Date(apt.appointment_date)
            const now = new Date()
            return appointmentDate > now && apt.status !== 'cancelled'
          })
          
          setAppointments(upcomingAppointments.slice(0, 5)) // Limiter à 5 notifications
          setUnreadCount(upcomingAppointments.length)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAppointmentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'presentiel': 'Présentiel',
      'visio': 'Visioconférence',
      'domicile': 'À domicile',
      'urgence': 'Urgence',
      'suivi': 'Suivi'
    }
    return types[type] || type
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'visio':
        return '📹'
      case 'domicile':
        return '🏠'
      case 'urgence':
        return '🚨'
      case 'suivi':
        return '📋'
      default:
        return '🏥'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 rounded-lg p-2"
        >
          <Bell className="w-5 h-5 text-teal-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl"
      >
        <DropdownMenuLabel className="font-semibold text-slate-900 dark:text-slate-100 px-3 py-2">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        
        {isLoading ? (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : appointments.length > 0 ? (
          <>
            {appointments.map((appointment) => (
              <DropdownMenuItem 
                key={appointment.id}
                className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 rounded-lg p-3 group"
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="text-lg">
                    {getAppointmentTypeIcon(appointment.appointment_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        Dr. {appointment.doctor.name}
                      </p>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                      >
                        {getAppointmentTypeLabel(appointment.appointment_type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 truncate">
                      {appointment.reason_for_visit}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(appointment.appointment_date)}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-3 text-center"
              onClick={() => window.location.href = '/dashboard'}
            >
              <span className="text-sm text-teal-600 dark:text-teal-400 font-medium w-full">
                Voir tous les rendez-vous
              </span>
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune notification</p>
            <p className="text-xs mt-1">Vos prochains rendez-vous apparaîtront ici</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}