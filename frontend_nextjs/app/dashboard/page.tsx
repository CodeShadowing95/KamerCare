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
  Activity,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  specialty: string
  hospital: string
  status: 'requested' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  type: 'consultation' | 'follow-up' | 'emergency'
  createdBy: 'doctor' | 'patient' // Nouveau champ pour identifier qui a créé le RDV
  reason?: string // Raison de la consultation
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
    type: 'consultation',
    createdBy: 'doctor',
    reason: 'Contrôle de routine'
  },
  {
    id: '2',
    date: '2024-01-20',
    time: '14:30',
    doctor: 'Dr. Jean Kamga',
    specialty: 'Dermatologie',
    hospital: 'Clinique des Spécialités',
    status: 'scheduled',
    type: 'follow-up',
    createdBy: 'patient',
    reason: 'Suivi traitement acné'
  },
  {
    id: '3',
    date: '2024-01-10',
    time: '11:00',
    doctor: 'Dr. Sarah Nkomo',
    specialty: 'Médecine Générale',
    hospital: 'Centre Médical Moderne',
    status: 'completed',
    type: 'consultation',
    createdBy: 'patient',
    reason: 'Consultation générale'
  },
  {
    id: '4',
    date: '2024-01-05',
    time: '16:00',
    doctor: 'Dr. Paul Mbarga',
    specialty: 'Orthopédie',
    hospital: 'Hôpital Général',
    status: 'completed',
    type: 'consultation',
    createdBy: 'doctor',
    reason: 'Douleur genou'
  },
  {
    id: '5',
    date: '2024-01-25',
    time: '10:30',
    doctor: 'Dr. Anne Fotso',
    specialty: 'Gynécologie',
    hospital: 'Clinique Moderne',
    status: 'requested',
    type: 'consultation',
    createdBy: 'patient',
    reason: 'Consultation préventive'
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [activeView, setActiveView] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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

  const getCreatorBadge = (createdBy: string) => {
    return createdBy === 'doctor' ? (
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
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  )
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'completed'
  )

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <header className="bg-gradient-to-r from-white/95 via-blue-50/80 to-indigo-50/70 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-900/85 backdrop-blur-md border-b border-blue-200/40 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo et titre */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="relative">
                  <img 
                    src="/KamerCare-logo.png" 
                    alt="KamerCare Logo" 
                    className="w-9 h-9 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }}
                  />
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md hidden group-hover:shadow-lg transition-all duration-300">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-base font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    KamerCare
                  </div>
                  <div className="text-[9px] leading-tight text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                    Votre santé, notre priorité
                  </div>
                </div>
              </Link>
              
            </div>

            {/* Navigation compacte */}
            <nav className="hidden md:flex space-x-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-blue-100/50 dark:border-gray-700/50 shadow-sm">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  activeView === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveView('appointments')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  activeView === 'appointments'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                }`}
              >
                Mes Rendez-vous
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                  activeView === 'history'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                }`}
              >
                Historique
              </button>
            </nav>

            {/* Actions compactes */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative w-8 h-8 p-0 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 rounded-lg group">
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse shadow-sm"></span>
              </Button>
              
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 text-xs px-3 py-1.5 h-8">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Nouveau RDV
              </Button>
              
              <div className="relative group">
                <Avatar className="w-7 h-7 ring-2 ring-blue-200/50 dark:ring-blue-700/50 hover:ring-blue-300 dark:hover:ring-blue-600 transition-all duration-200">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Indicateur de statut en ligne */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border border-white dark:border-gray-800 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        {new Set(appointments.map(apt => apt.doctor)).size}
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
                        {new Set(appointments.map(apt => apt.hospital)).size}
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
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <CalendarDays className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">Prochains rendez-vous</span>
                </CardTitle>
                <CardDescription className="text-xs text-gray-600 dark:text-gray-400 ml-11">
                  Vos rendez-vous à venir dans les prochains jours
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="group relative flex items-center justify-between p-3 bg-gradient-to-r from-white/60 to-blue-50/40 dark:from-gray-700/60 dark:to-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-800/30 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                        {/* Élément décoratif */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="flex items-center space-x-3 relative z-10">
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{appointment.doctor}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{appointment.specialty}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/60 px-2 py-0.5 rounded-md">
                                {new Date(appointment.date).toLocaleDateString('fr-FR')} • {appointment.time}
                              </span>
                              {getCreatorBadge(appointment.createdBy)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                          {getStatusBadge(appointment.status)}
                          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 hover:bg-blue-100/80 dark:hover:bg-blue-900/40">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {upcomingAppointments.length > 3 && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200/50 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40 text-blue-700 dark:text-blue-300 font-medium"
                        onClick={() => setActiveView('appointments')}
                      >
                        Voir tous les rendez-vous ({upcomingAppointments.length})
                      </Button>
                    )}
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

        {/* Vue des rendez-vous */}
        {activeView === 'appointments' && (
          <div className="space-y-6">
            {/* Header avec recherche et filtres */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Rendez-vous</h2>
                  <p className="text-gray-600 dark:text-gray-400">Gérez tous vos rendez-vous médicaux</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="requested">Demandé</option>
                    <option value="scheduled">Programmé</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des rendez-vous */}
            <div className="grid gap-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            {getTypeIcon(appointment.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {appointment.doctor}
                              </h3>
                              {getStatusBadge(appointment.status)}
                              {getCreatorBadge(appointment.createdBy)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Stethoscope className="w-4 h-4" />
                                  <span>{appointment.specialty}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{appointment.hospital}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            {appointment.reason && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <strong>Motif:</strong> {appointment.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Aucun rendez-vous trouvé avec les critères de recherche actuels.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Vue de l'historique */}
        {activeView === 'history' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Historique des consultations</h2>
              <p className="text-gray-600 dark:text-gray-400">Consultez l'historique de toutes vos consultations passées</p>
            </div>

            <div className="grid gap-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {appointment.doctor}
                              </h3>
                              {getStatusBadge(appointment.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Stethoscope className="w-4 h-4" />
                                  <span>{appointment.specialty}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{appointment.hospital}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            {appointment.reason && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <strong>Motif:</strong> {appointment.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Voir le rapport
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Aucun historique de consultation disponible.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Toaster />
    </div>
  )
}