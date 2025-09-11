"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Edit, 
  Plus, 
  FileText, 
  Heart, 
  Stethoscope,
  CalendarDays,
  Settings,
  Bell,
  Activity
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  hospital: string
  status: 'requested' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  type: 'consultation' | 'follow-up' | 'emergency'
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '09:00',
    doctor: 'Dr. Marie Dubois',
    specialty: 'Cardiologie',
    hospital: 'Hôpital Central de Yaoundé',
    status: 'confirmed',
    type: 'consultation'
  },
  {
    id: '2',
    date: '2024-01-20',
    time: '14:30',
    doctor: 'Dr. Jean Kamga',
    specialty: 'Dermatologie',
    hospital: 'Clinique des Spécialités',
    status: 'scheduled',
    type: 'follow-up'
  },
  {
    id: '3',
    date: '2024-01-10',
    time: '11:00',
    doctor: 'Dr. Sarah Nkomo',
    specialty: 'Médecine Générale',
    hospital: 'Centre Médical Moderne',
    status: 'completed',
    type: 'consultation'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [activeTab, setActiveTab] = useState('appointments')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de votre dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      requested: 'bg-orange-100 text-orange-700 border-orange-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      no_show: 'bg-gray-100 text-gray-700 border-gray-200',
      // Anciens statuts pour compatibilité
      pending: 'bg-amber-100 text-amber-700 border-amber-200'
    }
    
    const labels = {
      requested: 'Demandé',
      scheduled: 'Programmé',
      confirmed: 'Confirmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Absent',
      // Anciens labels pour compatibilité
      pending: 'En attente'
    }
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4" />
      case 'follow-up':
        return <Activity className="w-4 h-4" />
      case 'emergency':
        return <Heart className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  )
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'completed'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bonjour, {user?.name} 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos rendez-vous et informations médicales
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RDV à venir</p>
                    <p className="text-2xl font-bold text-emerald-600">{upcomingAppointments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RDV terminés</p>
                    <p className="text-2xl font-bold text-blue-600">{pastAppointments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Médecins consultés</p>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hôpitaux visités</p>
                    <p className="text-2xl font-bold text-teal-600">2</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Mes RDV</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
                    <CalendarDays className="w-5 h-5" />
                    <span>Rendez-vous à venir</span>
                  </CardTitle>
                  <CardDescription>
                    Vos prochains rendez-vous médicaux
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(appointment.type)}
                            <h4 className="font-semibold text-gray-900 dark:text-white">{appointment.doctor}</h4>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4" />
                            <span>{appointment.specialty}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.hospital}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <FileText className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Alert>
                      <Calendar className="w-4 h-4" />
                      <AlertDescription>
                        Aucun rendez-vous à venir. Prenez un nouveau rendez-vous pour consulter un médecin.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Past Appointments */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
                    <Activity className="w-5 h-5" />
                    <span>Historique</span>
                  </CardTitle>
                  <CardDescription>
                    Vos rendez-vous passés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 opacity-75">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(appointment.type)}
                            <h4 className="font-semibold text-gray-900 dark:text-white">{appointment.doctor}</h4>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4" />
                            <span>{appointment.specialty}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.hospital}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button size="sm" variant="outline" className="w-full">
                            <FileText className="w-4 h-4 mr-2" />
                            Voir le rapport
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Alert>
                      <Activity className="w-4 h-4" />
                      <AlertDescription>
                        Aucun historique de rendez-vous disponible.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                    <Button size="sm" className="mt-2">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier la photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="mt-1 text-gray-900 dark:text-white">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone</label>
                      <p className="mt-1 text-gray-900 dark:text-white">+237 6XX XXX XXX</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de naissance</label>
                      <p className="mt-1 text-gray-900 dark:text-white">01/01/1990</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse</label>
                      <p className="mt-1 text-gray-900 dark:text-white">Yaoundé, Cameroun</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Groupe sanguin</label>
                      <p className="mt-1 text-gray-900 dark:text-white">O+</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier les informations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres du compte</span>
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences et paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Notifications par email</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir des notifications pour vos rendez-vous</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Activé
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Notifications SMS</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir des rappels par SMS</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Désactivé
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Changer le mot de passe</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mettre à jour votre mot de passe</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  )
}