"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart, 
  Stethoscope,
  CalendarDays,
  Activity,
  CheckCircle,
  AlertCircle,
  X,
  CreditCard,
  CalendarX
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useAppointments, type Appointment } from "@/hooks/use-appointments"
import { DoctorSpecialization } from "@/components/ui/doctor-specialization"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments({ upcoming: true })
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      requested: 'bg-amber-50 text-amber-700 border-amber-200',
      scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
      confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
      completed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      no_show: 'bg-gray-50 text-gray-700 border-gray-200'
    }
    
    const labels = {
      requested: 'Demandé',
      scheduled: 'Programmé',
      confirmed: 'Confirmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent'
    }
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border text-xs`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentiel':
        return <Stethoscope className="w-4 h-4" />
      case 'suivi':
        return <Activity className="w-4 h-4" />
      case 'urgence':
        return <Heart className="w-4 h-4" />
      case 'visio':
        return <Calendar className="w-4 h-4" />
      case 'domicile':
        return <MapPin className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getCreatorBadge = (createdBy?: { role: string }) => {
    return createdBy?.role === 'doctor' ? (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
        Programmé par médecin
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
        Demandé par patient
      </Badge>
    )
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  )
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointment_date) < new Date() || apt.status === 'completed'
  )

  return (
    <div className="space-y-8">
      {/* Vue d'ensemble */}
      {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-blue-100 dark:border-gray-700 p-5 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-lg transform -translate-x-8 translate-y-8"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-xl">👋</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                      Bonjour, {user?.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Aperçu de vos rendez-vous médicaux
                    </p>
                  </div>
                </div>
                <div className="text-right bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center justify-end space-x-1 mb-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">En ligne</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="relative bg-gradient-to-br from-blue-50/80 via-white to-blue-50/50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border border-blue-100/50 dark:border-gray-700/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">RDV à venir</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">{upcomingAppointments.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border border-emerald-100/50 dark:border-gray-700/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Terminées</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">{pastAppointments.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-purple-50/80 via-white to-purple-50/50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-purple-900/20 border border-purple-100/50 dark:border-gray-700/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Médecins</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                        {new Set(appointments.map(apt => `${apt.doctor.first_name} ${apt.doctor.last_name}`)).size}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative bg-gradient-to-br from-orange-50/80 via-white to-orange-50/50 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-orange-900/20 border border-orange-100/50 dark:border-gray-700/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Établissements</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
                        {new Set(appointments.map(apt => apt.location || 'Non spécifié')).size}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochains rendez-vous */}
            <Card className="bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-800/80 dark:to-blue-900/20 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">Prochains rendez-vous</span>
                  </div>
                  {upcomingAppointments.length > 5 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                      onClick={() => setActiveView('appointments')}
                    >
                      Voir tout ({upcomingAppointments.length})
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="text-xs text-gray-600 dark:text-gray-400 ml-11">
                  Vos rendez-vous à venir dans les prochains jours
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement des rendez-vous...</span>
                  </div>
                ) : appointmentsError ? (
                  <div className="flex items-center justify-center py-8">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-600 dark:text-red-400">Erreur lors du chargement des rendez-vous</span>
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {upcomingAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="group relative bg-gradient-to-br from-white/70 to-blue-50/30 dark:from-gray-700/70 dark:to-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        {/* Élément décoratif */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10 space-y-2">
                          {/* En-tête avec icône et statut */}
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                              {getTypeIcon(appointment.appointment_type)}
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          {/* Informations principales */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                            </h4>
                            <DoctorSpecialization 
                              specialization={appointment.doctor.specialization}
                              className="text-xs text-gray-600 dark:text-gray-400 font-medium"
                              maxWidth="max-w-[150px]"
                            />
                          </div>
                          
                          {/* Date et heure */}
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} • {new Date(appointment.appointment_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          {/* Hôpital */}
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{appointment.location || 'Non spécifié'}</span>
                          </div>
                          
                          {/* Badge créateur */}
                          <div className="pt-1">
                            {getCreatorBadge(appointment.created_by)}
                          </div>
                          
                          {/* Boutons d'action */}
                          <div className="pt-2 flex gap-1">
                            {appointment.status === 'confirmed' ? (
                              // Si confirmé par l'utilisateur
                              <>
                                <Button 
                                  size="sm" 
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/reglement?appointment=${appointment.id}`)
                                  }}
                                >
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  Régler
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    try {
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) {
                                        console.error('Token d\'authentification manquant')
                                        return
                                      }

                                      const response = await fetch(`http://localhost:8000/api/appointments/${appointment.id}/cancel`, {
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
                                          window.location.reload()
                                        } else {
                                          console.error('Erreur lors de l\'annulation:', data.message)
                                        }
                                      } else {
                                        console.error('Erreur lors de l\'annulation du rendez-vous')
                                      }
                                    } catch (error) {
                                      console.error('Erreur lors de l\'annulation du rendez-vous:', error)
                                    }
                                  }}
                                >
                                  <CalendarX className="w-3 h-3 mr-1" />
                                  Annuler
                                </Button>
                              </>
                            ) : appointment.status === 'scheduled' ? (
                              // Si juste programmé par le docteur
                              <>
                                <Button 
                                  size="sm" 
                                  className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700"
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    try {
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) {
                                        console.error('Token d\'authentification manquant')
                                        return
                                      }

                                      const response = await fetch(`http://localhost:8000/api/appointments/${appointment.id}/accept`, {
                                        method: 'POST',
                                        headers: {
                                          'Authorization': `Bearer ${token}`,
                                          'Content-Type': 'application/json',
                                        }
                                      })

                                      if (response.ok) {
                                        const data = await response.json()
                                        if (data.success) {
                                          window.location.reload()
                                        } else {
                                          console.error('Erreur lors de la confirmation:', data.message)
                                        }
                                      } else {
                                        console.error('Erreur lors de la confirmation du rendez-vous')
                                      }
                                    } catch (error) {
                                      console.error('Erreur lors de la confirmation du rendez-vous:', error)
                                    }
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirmer
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={async (e) => {
                                    e.stopPropagation()
                                    try {
                                      const token = localStorage.getItem('auth_token')
                                      if (!token) {
                                        console.error('Token d\'authentification manquant')
                                        return
                                      }

                                      const response = await fetch(`http://localhost:8000/api/appointments/${appointment.id}/cancel`, {
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
                                          window.location.reload()
                                        } else {
                                          console.error('Erreur lors de l\'annulation:', data.message)
                                        }
                                      } else {
                                        console.error('Erreur lors de l\'annulation du rendez-vous')
                                      }
                                    } catch (error) {
                                      console.error('Erreur lors de l\'annulation du rendez-vous:', error)
                                    }
                                  }}
                                >
                                  <CalendarX className="w-3 h-3 mr-1" />
                                  Annuler
                                </Button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert className="bg-gradient-to-r from-orange-50/80 to-yellow-50/50 dark:from-orange-900/20 dark:to-yellow-900/10 border-orange-200/50 dark:border-orange-700/30">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <AlertDescription className="text-sm text-orange-700 dark:text-orange-300">
                      Aucun rendez-vous à venir. Prenez un nouveau rendez-vous pour consulter un médecin.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  )
}