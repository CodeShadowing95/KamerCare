'use client'

import { useState, useEffect } from 'react'
import { Bell, Calendar, Clock, User, MapPin, Check, X, CheckCheck, CalendarClock, Banknote, HandCoins } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

interface Appointment {
  id: number
  appointment_date: string
  reason_for_visit: string
  appointment_type: string
  consultation_fee?: number
  location?: string
  doctor?: {
    name: string
    specialization?: string
  } | null
  status: 'requested' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  payment_status?: 'pending' | 'paid' | 'unpaid' | 'refunded'
  created_by?: {
    id: number
    first_name: string
    last_name: string
    role: 'patient' | 'doctor' | 'admin'
  }
  created_at: string
}

export default function NotificationsDropdown() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [actionLoading, setActionLoading] = useState<{ [key: number]: 'accept' | 'reject' | null }>({})

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

  // Fonction pour accepter un rendez-vous
  const handleAcceptAppointment = async (appointmentId: number) => {
    setActionLoading(prev => ({ ...prev, [appointmentId]: 'accept' }))
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Rafraîchir la liste des rendez-vous
        await fetchAppointments()
      } else {
        console.error('Erreur lors de l\'acceptation du rendez-vous')
      }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation du rendez-vous:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: null }))
    }
  }

  // Fonction pour refuser un rendez-vous
  const handleRejectAppointment = async (appointmentId: number) => {
    setActionLoading(prev => ({ ...prev, [appointmentId]: 'reject' }))
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Rafraîchir la liste des rendez-vous
        await fetchAppointments()
      } else {
        console.error('Erreur lors du refus du rendez-vous')
      }
    } catch (error) {
      console.error('Erreur lors du refus du rendez-vous:', error)
    } finally {
      setActionLoading(prev => ({ ...prev, [appointmentId]: null }))
    }
  }

  // Fonction pour annuler un rendez-vous
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cancellation_reason: 'Annulé par le patient' 
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Rafraîchir la liste des rendez-vous
          await fetchAppointments()
        } else {
          console.error('Erreur lors de l\'annulation:', data.message)
        }
      } else {
        console.error('Erreur lors de l\'annulation du rendez-vous')
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error)
    }
  }

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

  const getDoctorInitials = (doctorName?: string) => {
    if (!doctorName) return 'DR'
    const names = doctorName.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
  }

  // Fonction pour calculer le temps écoulé depuis la création
  const getTimeAgo = (createdAt: string): string => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `il y a ${diffInSeconds}s`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `il y a ${minutes} min`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `il y a ${hours}h`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `il y a ${days} jour${days > 1 ? 's' : ''}`
    }
  }

  const getNotificationMessage = (appointment: Appointment) => {
    const isCreatedByCurrentUser = appointment.created_by?.id === user?.id
    const isCreatedByDoctor = appointment.created_by?.role === 'doctor'
    const doctorName = appointment.doctor?.name || 'Docteur non spécifié'

    if (isCreatedByCurrentUser) {
      return {
        title: `Votre demande de RDV`,
        subtitle: `avec Dr. ${doctorName} en attente de confirmation`,
        icon: '📋'
      }
    } else if (isCreatedByDoctor) {
      return {
        title: `RDV programmé`,
        subtitle: `par Dr. ${doctorName}`,
        icon: '👨‍⚕️'
      }
    } else {
      // Cas par défaut (si pas d'info sur le créateur)
      return {
        title: `RDV avec Dr. ${doctorName}`,
        subtitle: appointment.status === 'requested' ? 'En attente de confirmation' : 'Confirmé',
        icon: '🏥'
      }
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
        className="w-96 p-1 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-2xl"
      >
        <DropdownMenuLabel className="font-medium text-slate-800 dark:text-slate-200 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-teal-500" />
              <span className="text-sm">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>

        {isLoading ? (
          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
            <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              {appointments.map((appointment, index) => {
                const notificationMsg = getNotificationMessage(appointment)
                return (
                  <div key={appointment.id}>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-900/10 dark:hover:to-blue-900/10 transition-all duration-300 rounded-xl mx-2 my-1 p-3 group border border-transparent hover:border-teal-100 dark:hover:border-teal-800/30"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src="/doctor.png" alt="Doctor avatar" />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                            {getDoctorInitials(appointment.doctor?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* En-tête */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                {notificationMsg.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                {notificationMsg.subtitle}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 dark:bg-slate-800 px-2 py-1 rounded-full">
                              {getTimeAgo(appointment.created_at)}
                            </span>
                          </div>

                          {/* Date et statut */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                              <CalendarClock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {formatDate(appointment.appointment_date)}
                              </span>
                            </div>

                            {/* Actions selon le statut */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                {/* Boutons accepter/refuser */}
                                {appointment.created_by?.role === 'doctor' && appointment.status === 'scheduled' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="h-7 w-7 p-0 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 hover:text-green-700 border border-green-200 dark:border-green-800"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAcceptAppointment(appointment.id)
                                      }}
                                      disabled={actionLoading[appointment.id] === 'accept'}
                                    >
                                      {actionLoading[appointment.id] === 'accept' ? (
                                        <div className="animate-spin w-3 h-3 border border-green-600 border-t-transparent rounded-full" />
                                      ) : (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 border border-red-200 dark:border-red-800"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleRejectAppointment(appointment.id)
                                      }}
                                      disabled={actionLoading[appointment.id] === 'reject'}
                                    >
                                      {actionLoading[appointment.id] === 'reject' ? (
                                        <div className="animate-spin w-3 h-3 border border-red-600 border-t-transparent rounded-full" />
                                      ) : (
                                        <X className="w-3 h-3" />
                                      )}
                                    </Button>
                                  </>
                                )}

                                {/* Badge confirmé */}
                                {appointment.status === 'confirmed' && (
                                  <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                      Confirmé
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Section paiement pour les confirmés */}
                          {appointment.status === 'confirmed' && (
                            <div className="pt-1">
                              {appointment.payment_status === 'paid' ? (
                                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                                  <Banknote className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Payé</span>
                                </div>
                              ) : appointment.payment_status === 'unpaid' && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                      <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        {appointment.consultation_fee ? `${appointment.consultation_fee.toLocaleString()} FCFA` : 'Prix à définir'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Link
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                        href={`/reglement?appointment=${appointment.id}`}
                                      >
                                        Payer
                                      </Link>
                                      <button
                                        onClick={() => handleCancelAppointment(appointment.id)}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-1 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                      >
                                        <X className="w-3 h-3 text-white" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    {index < appointments.length - 1 && (
                      <div className="mx-4 border-b border-slate-100 dark:border-slate-800"></div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-900/10 dark:hover:to-blue-900/10 transition-all duration-300 rounded-xl mx-2 p-3 text-center group"
                onClick={() => window.location.href = '/dashboard'}
              >
                <div className="flex items-center justify-center space-x-2 w-full">
                  <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                    Voir tous les rendez-vous
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aucune notification</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Vos prochains rendez-vous apparaîtront ici</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}