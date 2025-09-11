"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface Appointment {
  id: number
  patient_id: number
  patient_name: string
  patient_phone: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  reason: string
  notes?: string
  status: 'requested' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  payment_status: 'pending' | 'paid' | 'cancelled'
}

// Données mockées pour la démonstration
const mockAppointments: Appointment[] = [
  {
    id: 1,
    patient_id: 1,
    patient_name: "Marie Ngono",
    patient_phone: "+237 677 123 456",
    appointment_date: "2024-01-15",
    appointment_time: "09:00",
    duration_minutes: 30,
    reason: "Consultation générale",
    notes: "Première consultation",
    status: "confirmed",
    priority: "medium",
    payment_status: "pending"
  },
  {
    id: 2,
    patient_id: 2,
    patient_name: "Jean Mballa",
    patient_phone: "+237 677 234 567",
    appointment_date: "2024-01-15",
    appointment_time: "09:30",
    duration_minutes: 45,
    reason: "Suivi hypertension",
    notes: "Contrôle tension artérielle",
    status: "scheduled",
    priority: "high",
    payment_status: "paid"
  },
  {
    id: 3,
    patient_id: 3,
    patient_name: "Sarah Kamdem",
    patient_phone: "+237 677 345 678",
    appointment_date: "2024-01-15",
    appointment_time: "10:00",
    duration_minutes: 30,
    reason: "Consultation dermatologie",
    status: "in_progress",
    priority: "medium",
    payment_status: "pending"
  },
  {
    id: 4,
    patient_id: 4,
    patient_name: "Paul Nkomo",
    patient_phone: "+237 677 456 789",
    appointment_date: "2024-01-16",
    appointment_time: "14:00",
    duration_minutes: 60,
    reason: "Consultation cardiologie",
    notes: "Examen ECG prévu",
    status: "scheduled",
    priority: "urgent",
    payment_status: "pending"
  },
  {
    id: 5,
    patient_id: 5,
    patient_name: "Fatima Bello",
    patient_phone: "+237 677 567 890",
    appointment_date: "2024-01-12",
    appointment_time: "11:00",
    duration_minutes: 30,
    reason: "Consultation pédiatrie",
    status: "completed",
    priority: "low",
    payment_status: "paid"
  },
  {
    id: 6,
    patient_id: 6,
    patient_name: "Ahmed Hassan",
    patient_phone: "+237 677 678 901",
    appointment_date: "2024-01-13",
    appointment_time: "15:30",
    duration_minutes: 30,
    reason: "Consultation générale",
    status: "no_show",
    priority: "medium",
    payment_status: "cancelled"
  }
]

export default function AppointmentsList() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Fonction pour ouvrir le modal avec les détails du rendez-vous
  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  // Protection de route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/doctor/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Filtrage des rendez-vous
  useEffect(() => {
    let filtered = appointments

    // Filtre par onglet
    const today = new Date().toISOString().split('T')[0]
    if (activeTab === "today") {
      filtered = filtered.filter(apt => apt.appointment_date === today)
    } else if (activeTab === "upcoming") {
      filtered = filtered.filter(apt => apt.appointment_date >= today && apt.status !== 'completed' && apt.status !== 'cancelled')
    } else if (activeTab === "past") {
      filtered = filtered.filter(apt => apt.appointment_date < today || apt.status === 'completed')
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Filtre par priorité
    if (priorityFilter !== "all") {
      filtered = filtered.filter(apt => apt.priority === priorityFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter, priorityFilter, dateFilter, activeTab])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { label: "Demandé", variant: "outline" as const, icon: Clock },
      scheduled: { label: "Programmé", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Confirmé", variant: "default" as const, icon: CheckCircle },
      in_progress: { label: "En cours", variant: "default" as const, icon: AlertCircle },
      completed: { label: "Terminé", variant: "default" as const, icon: CheckCircle },
      cancelled: { label: "Annulé", variant: "destructive" as const, icon: XCircle },
      no_show: { label: "Absent", variant: "destructive" as const, icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Faible", className: "bg-green-100 text-green-800" },
      medium: { label: "Moyenne", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Élevée", className: "bg-orange-100 text-orange-800" },
      urgent: { label: "Urgente", className: "bg-red-100 text-red-800" }
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig]

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      pending: { label: "Pas encore", className: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Payé💸", className: "bg-green-100 text-green-800" },
      refunded: { label: "Remboursée", className: "bg-blue-100 text-blue-800" }
    }

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTabCounts = () => {
    const today = new Date().toISOString().split('T')[0]
    return {
      all: appointments.length,
      today: appointments.filter(apt => apt.appointment_date === today).length,
      upcoming: appointments.filter(apt => apt.appointment_date >= today && apt.status !== 'completed' && apt.status !== 'cancelled').length,
      past: appointments.filter(apt => apt.appointment_date < today || apt.status === 'completed').length
    }
  }

  const tabCounts = getTabCounts()

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
    <div className="min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestion des Rendez-vous 📅
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Consultez et gérez tous vos rendez-vous programmés
              </p>
            </div>
            <Link href="/doctor/appointments/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Rendez-vous
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="scheduled">Programmé</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="no_show">Absent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPriorityFilter("all")
                  setDateFilter("all")
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Tous ({tabCounts.all})</span>
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Aujourd'hui ({tabCounts.today})</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>À venir ({tabCounts.upcoming})</span>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Passés ({tabCounts.past})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Liste des Rendez-vous</span>
                  <Badge variant="secondary">{filteredAppointments.length} résultat(s)</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Date & Heure</TableHead>
                          <TableHead>Motif</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Priorité</TableHead>
                          <TableHead>Durée</TableHead>
                          <TableHead>Paiement</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((appointment) => (
                          <TableRow key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {appointment.patient_name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {appointment.patient_name}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {appointment.patient_phone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                  {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                  {appointment.appointment_time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium text-sm">{appointment.reason}</div>
                                {appointment.notes && (
                                  <div className="text-xs text-gray-500 mt-1">{appointment.notes}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(appointment.status)}
                            </TableCell>
                            <TableCell>
                              {getPriorityBadge(appointment.priority)}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-600">{appointment.duration_minutes} min</span>
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(appointment.payment_status || 'pending')}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openAppointmentDetails(appointment)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Annuler
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Aucun rendez-vous trouvé
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Aucun rendez-vous ne correspond à vos critères de recherche.
                    </p>
                    <Link href="/doctor/appointments/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un nouveau rendez-vous
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal des détails du rendez-vous */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Détails du Rendez-vous
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Informations complètes sur le rendez-vous sélectionné
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 mt-6">
              {/* Informations du patient */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Informations Patient
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nom complet</p>
                    <p className="font-medium text-gray-900 dark:text-white text-lg">{selectedAppointment.patient_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      {selectedAppointment.patient_phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations du rendez-vous */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Détails du Rendez-vous
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedAppointment.appointment_date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Heure</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedAppointment.appointment_time}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Durée</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedAppointment.duration_minutes} minutes</p>
                  </div>
                </div>
              </div>

              {/* Motif et notes */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Motif et Notes
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Motif de la visite</p>
                    <p className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded-lg border">
                      {selectedAppointment.reason}
                    </p>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notes additionnelles</p>
                      <p className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded-lg border">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statuts */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statuts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut du rendez-vous</p>
                    <div>{getStatusBadge(selectedAppointment.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Priorité</p>
                    <div>{getPriorityBadge(selectedAppointment.priority)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Statut de paiement</p>
                    <div>{getPaymentStatusBadge(selectedAppointment.payment_status)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le rendez-vous
                </Button>
                <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marquer comme terminé
                </Button>
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Annuler le rendez-vous
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}