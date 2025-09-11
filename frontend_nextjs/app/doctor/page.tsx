"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Appointment, useAppointments } from "@/hooks/use-appointments"
import { useAppointmentRequests, AppointmentRequest } from "@/hooks/use-appointment-requests"

import {
  Calendar,
  Users,
  Clock,
  Settings,
  CheckCircle,
  FileText,
  Eye,
  Edit,
  Plus,
  Trash2,
  Star,
  Activity,
  TrendingUp,
  Filter,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
  List,
  AlertCircle,
  RefreshCw,
  Video,
  CreditCard,
  Check,
  X,
  Clock as ClockIcon,
  CalendarPlus,
  MapPin,
  Stethoscope,
  Phone,
  CalendarX,
  Mail,
  Search,
  ChevronDown,
  ChartLine,
  Hospital,
  HeartHandshake,
  ClockArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

// Fonction pour vérifier si une date est passée
const isDatePassed = (dateString: string) => {
  const appointmentDate = new Date(dateString);
  const now = new Date();

  console.log("Date actuelle: ", now)
  console.log("Date rendez-vous: ", appointmentDate)
  return appointmentDate < now;
};

// Composant pour le tableau des prochains rendez-vous
function UpcomingAppointmentsTable({ router }: { router: any }) {
  const { user } = useAuth()
  const { appointments, refetch, loading, error } = useAppointments({
    upcoming: true,
    doctor_id: user?.doctor?.id || user?.id
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-accent/10 text-accent border-accent/20"
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/20"
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "completed":
        return "bg-muted text-muted-foreground border-border"
      case "in_progress":
        return "bg-orange-100 text-orange-700 border-orange-200"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: Appointment["status"]) => {
    switch (status) {
      case "requested":
        return "Demandé"
      case "scheduled":
        return "Programmé"
      case "confirmed":
        return "Confirmé"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      case "no_show":
        return "Absent"
      default:
        return "En attente"
    }
  }

  const getPaymentStatusBadge = (paymentStatus: Appointment["payment_status"]) => {
    switch (paymentStatus) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 text-xs font-medium rounded-full">
            Payé💸
          </Badge>
        )
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 text-xs font-medium rounded-full">
            Remboursée
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 text-xs font-medium rounded-full">
            Pas encore
          </Badge>
        )
    }
  }

  const getStatusLabel = (status: Appointment["status"]) => {
    const labels = {
      requested: "Demandé",
      scheduled: "Programmé",
      confirmed: "Confirmé",
      in_progress: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
      no_show: "Absent",
    }
    return labels[status] || status
  }

  const getTypeLabel = (type: Appointment["appointment_type"]) => {
    const labels = {
      presentiel: "Présentiel",
      visio: "Visioconférence",
      domicile: "À domicile",
      urgence: "Urgence",
      suivi: "Suivi",
    }
    return labels[type] || type
  }

  // Fonction pour ouvrir le modal avec les détails du rendez-vous
  const openAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Prochains Rendez-vous</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400">Chargement des rendez-vous...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Prochains Rendez-vous</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Erreur de chargement</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Prochains Rendez-vous</span>
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-3 py-1 rounded-full">
                  {appointments.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2 text-base">
                Aperçu des prochains rendez-vous programmés
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="sm"
              className="hover:bg-green-50 dark:hover:bg-green-900/30 border border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 rounded-xl text-green-600 dark:text-green-400"
              title="Actualiser les données"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => router.push('/doctor/appointments')}
              variant="outline"
              size="sm"
              className="hover:bg-indigo-50 dark:hover:bg-slate-600 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Planning complet
            </Button>
          </div>

        </div>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Aucun rendez-vous à venir</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Votre planning est libre pour les prochains jours</p>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Planifier un rendez-vous
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
                {appointments.slice(0, 10).map((appointment, index) => {
                  const isPassed = isDatePassed(appointment.appointment_date);
                  return (
                    <tr key={appointment.id} className={`transition-colors duration-200 ${isPassed
                      ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                              {`${appointment.patient.first_name[0]}${appointment.patient.last_name[0]}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {appointment.patient.first_name} {appointment.patient.last_name}
                            </div>
                            {appointment.patient.phone && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {appointment.patient.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white font-medium">
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(appointment.appointment_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 dark:text-white max-w-xs truncate" title={appointment.reason_for_visit}>
                          {appointment.reason_for_visit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white font-medium">
                          {appointment.duration_minutes} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getStatusColor(appointment.status)} px-2 py-1 text-xs font-medium rounded-full`}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusBadge(appointment.payment_status || 'pending')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {isPassed ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 p-2 h-8 w-8"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200 p-2 h-8 w-8"
                                title="Voir les détails"
                                onClick={() => openAppointmentDetails(appointment)}
                              >
                                <Eye className="w-3 h-3 text-indigo-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 p-2 h-8 w-8"
                                title="Modifier"
                              >
                                <Edit className="w-3 h-3 text-green-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Modal des détails du rendez-vous */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto bg-white border-blue-200">
          <DialogHeader className="pb-2 bg-blue-50 -m-6 mb-4 p-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base font-semibold text-blue-900">Détails RDV</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex justify-between items-center gap-2 p-2 bg-teal-50 rounded-md border border-teal-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-medium text-xs">
                  {selectedAppointment?.patient?.first_name?.[0] || ''}
                  {selectedAppointment?.patient?.last_name?.[0] || ''}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-blue-900 truncate">
                    {selectedAppointment?.patient?.first_name} {selectedAppointment?.patient?.last_name}
                  </h3>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-blue-500" />
                    {selectedAppointment?.patient?.phone}
                  </p>
                </div>
              </div>

              <Badge className={`${selectedAppointment?.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300' :
                selectedAppointment?.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  selectedAppointment?.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                    'bg-gray-100 text-gray-800 border-gray-300'
                }`} variant="outline">
                {selectedAppointment?.status ? getStatusLabel(selectedAppointment.status) : ''}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-blue-900">Date:</span>
                <span className="text-gray-600">{selectedAppointment?.appointment_date ? formatDate(selectedAppointment.appointment_date) : 'Non disponible'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-blue-900">Heure:</span>
                <span className="text-gray-600">
                  {selectedAppointment?.appointment_date ? formatTime(selectedAppointment.appointment_date) : 'Non disponible'} ({selectedAppointment?.duration_minutes || 0}min)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Stethoscope className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-blue-900">Médecin:</span>
                <span className="text-gray-600">
                  Dr. {selectedAppointment?.doctor?.first_name} {selectedAppointment?.doctor?.last_name}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium text-blue-900">Type:</span>
                <span className="text-gray-600">{selectedAppointment?.appointment_type ? getTypeLabel(selectedAppointment.appointment_type) : 'Non spécifié'}</span>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <FileText className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-blue-900">Motif:</span>
                <span className="text-gray-600">{selectedAppointment?.reason_for_visit || 'Non spécifié'}</span>
              </div>

              {selectedAppointment?.payment_status && (
                <div className="flex items-center gap-2 text-xs">
                  <CreditCard className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-blue-900">Paiement:</span>
                  <span className="text-gray-600 capitalize">{getPaymentStatusBadge(selectedAppointment?.payment_status || 'pending')}</span>
                </div>
              )}
            </div>

            {/* Notes - Ultra Compact */}
            {selectedAppointment?.notes && (
              <>
                <Separator className="my-2 border-blue-200" />
                <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <FileText className="h-3 w-3 inline mr-1 text-blue-500" />
                    {selectedAppointment?.notes}
                  </p>
                </div>
              </>
            )}

            <Separator className="my-2 border-blue-200" />

            {/* Action Buttons - Avec textes */}
            <div className="flex flex-col gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 flex items-center gap-2 justify-center">
                <Edit className="h-3 w-3" />
                <span>Modifier</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent text-xs px-3 py-2 flex items-center gap-2 justify-center"
              >
                <CalendarPlus className="h-3 w-3" />
                <span>Calendrier</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent text-xs px-3 py-2 flex items-center gap-2 justify-center"
              >
                <CalendarX className="h-3 w-3" />
                <span>Annuler</span>
              </Button>
            </div>

            {/* Footer Note - Ultra Compact */}
            <div className="text-xs text-gray-500 text-center p-1 bg-gray-100 rounded text-[10px] border border-gray-200">
              SMS 24h avant • Annulation 24h min
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Composant pour le tableau des rendez-vous du jour
function TodayAppointmentsTable({ router }: { router: any }) {
  const { user } = useAuth()
  const { appointments, refetch, loading, error } = useAppointments({
    today: true,
    doctor_id: user?.doctor?.id || user?.id
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'no_show': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé'
      case 'scheduled': return 'Programmé'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return 'En attente'
    }
  }

  // Fonction pour vérifier si un rendez-vous est à 30 minutes ou moins
  const isWithin30Minutes = (appointmentDate: string) => {
    const now = new Date()
    const appointmentTime = new Date(appointmentDate)
    const diffInMinutes = (appointmentTime.getTime() - now.getTime()) / (1000 * 60)
    return diffInMinutes <= 30 && diffInMinutes >= 0
  }

  // Filtrer les rendez-vous du jour actuel
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_date)
    const today = new Date()
    return appointmentDate.toDateString() === today.toDateString()
  })

  if (loading) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Rendez-vous du jour</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400">Chargement des rendez-vous...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Rendez-vous du jour</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Erreur de chargement</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Rendez-vous du jour</span>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full">
                  {todayAppointments.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-2 text-base">
                Tous les rendez-vous programmés pour aujourd'hui
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => refetch()}
              variant="ghost"
              size="sm"
              className="hover:bg-green-50 dark:hover:bg-green-900/30 border border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 rounded-xl text-green-600 dark:text-green-400"
              title="Actualiser les données"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => router.push('/doctor/appointments')}
              variant="outline"
              size="sm"
              className="hover:bg-blue-50 dark:hover:bg-slate-600 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <List className="w-4 h-4 mr-2" />
              Voir tous
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-slate-600 border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-purple-50 dark:hover:bg-slate-600 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {todayAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="w-10 h-10 text-orange-500 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Aucun rendez-vous aujourd'hui</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Vous n'avez pas de rendez-vous programmés pour aujourd'hui</p>
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Planifier un rendez-vous
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
                {todayAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white text-xs font-bold">
                            {`${appointment.patient.first_name[0]}${appointment.patient.last_name[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {appointment.patient.first_name} {appointment.patient.last_name}
                          </div>
                          {appointment.patient.phone && (
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {appointment.patient.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white font-medium">
                        {formatTime(appointment.appointment_date)}
                      </div>
                      {isWithin30Minutes(appointment.appointment_date) && (
                        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                          Dans moins de 30 min
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-500 dark:text-white max-w-xs truncate" title={appointment.reason_for_visit}>
                        {appointment.reason_for_visit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white font-medium">
                        {appointment.duration_minutes} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(appointment.status)} px-2 py-1 text-xs font-medium rounded-full`}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {isWithin30Minutes(appointment.appointment_date) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 p-2 h-8 w-8 bg-red-50 dark:bg-red-900/20"
                            title="Démarrer l'appel vidéo"
                          >
                            <Video className="w-3 h-3 text-red-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-200 p-2 h-8 w-8"
                          title="Voir les détails"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 p-2 h-8 w-8"
                          title="Modifier"
                        >
                          <Edit className="w-3 h-3 text-green-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>


    </Card>
  )
}

// Composant pour le tableau des demandes de rendez-vous
function AppointmentRequestsTable({ router }: { router: any }) {
  const { requests, loading, error, refetch, confirmRequest, cancelRequest } = useAppointmentRequests()
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleConfirm = async (id: number) => {
    setConfirmingId(id)
    const success = await confirmRequest(id)
    if (success) {
      // Optionally show success message
    }
    setConfirmingId(null)
  }

  const handleCancel = async (id: number) => {
    setCancellingId(id)
    const success = await cancelRequest(id, "Refusé par le docteur")
    if (success) {
      // Optionally show success message
    }
    setCancellingId(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }



  // Fonction pour filtrer les demandes
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason_for_visit.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === '' || request.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === '' || (request?.payment_status || 'pending') === selectedPaymentStatus

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const handleFilterApply = () => {
    setIsFilterOpen(false)
  }

  const handleFilterReset = () => {
    setSelectedStatus('')
    setSelectedPaymentStatus('')
  }

  return (
    <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
      <CardHeader className="space-y-4 pb-3">
        <div className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Nouvelles Demandes
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
              {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} affichée{filteredRequests.length !== 1 ? 's' : ''} sur {requests.length}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 px-2 py-0.5 text-xs">
              <ClockIcon className="w-3 h-3 mr-1" />
              {requests.length} en attente
            </Badge>
            <div className="w-0.5 h-6 bg-gray-200" />
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Recherche par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs h-7 pl-8 border-slate-200 focus:border-orange-400 focus:ring-orange-400 rounded-md"
              />
            </div>
            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-sm text-gray-500 border-slate-300 hover:text-gray-600 hover:border-orange-400 hover:bg-orange-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Statut du RDV</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === ''}
                  onCheckedChange={() => setSelectedStatus('')}
                >
                  Tous les statuts
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === 'pending'}
                  onCheckedChange={() => setSelectedStatus(selectedStatus === 'pending' ? '' : 'pending')}
                >
                  En attente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === 'confirmed'}
                  onCheckedChange={() => setSelectedStatus(selectedStatus === 'confirmed' ? '' : 'confirmed')}
                >
                  Confirmé
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedStatus === 'cancelled'}
                  onCheckedChange={() => setSelectedStatus(selectedStatus === 'cancelled' ? '' : 'cancelled')}
                >
                  Annulé
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Statut de paiement</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={selectedPaymentStatus === ''}
                  onCheckedChange={() => setSelectedPaymentStatus('')}
                >
                  Tous les paiements
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPaymentStatus === 'pending'}
                  onCheckedChange={() => setSelectedPaymentStatus(selectedPaymentStatus === 'pending' ? '' : 'pending')}
                >
                  En attente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPaymentStatus === 'paid'}
                  onCheckedChange={() => setSelectedPaymentStatus(selectedPaymentStatus === 'paid' ? '' : 'paid')}
                >
                  Payé
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedPaymentStatus === 'failed'}
                  onCheckedChange={() => setSelectedPaymentStatus(selectedPaymentStatus === 'failed' ? '' : 'failed')}
                >
                  Échoué
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                <div className="flex items-center space-x-2 p-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleFilterReset}
                    className="flex-1 h-8 text-xs"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleFilterApply}
                    className="flex-1 h-8 text-xs bg-orange-600 hover:bg-orange-700"
                  >
                    Valider
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="hover:bg-orange-50 dark:hover:bg-slate-700 border-slate-300 hover:border-orange-400 transition-all duration-300 hover:scale-105 rounded-xl h-8 w-8 p-0"
            >
              <RefreshCw className={`w-3 h-3 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-3"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Chargement des demandes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              <Button
                onClick={refetch}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Réessayer
              </Button>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                <ClockIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Aucune demande</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Aucune demande de rendez-vous en attente pour le moment</p>
              <Button
                onClick={refetch}
                variant="outline"
                className="mt-4 border-orange-300 text-orange-600 hover:bg-orange-50 h-8 text-xs"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Patient</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Date & Heure</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Motif</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Durée</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Statut</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Paiement</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Tarif</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const isPassed = isDatePassed(request.appointment_date);
                  return (
                    <tr key={request.id} className={`border-b border-slate-100 dark:border-slate-700 transition-all duration-300 group ${isPassed
                      ? 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30'
                      : 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-slate-800 dark:hover:to-slate-700'
                      }`}>
                      <td className="py-2 px-3">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 ring-1 ring-orange-100 group-hover:ring-orange-200 transition-all duration-300">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white font-semibold text-xs">
                              {request.patient.first_name[0]}{request.patient.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                              {request.patient.first_name} {request.patient.last_name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{request.patient.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs text-slate-900 dark:text-slate-100">
                          <div className="font-medium">{formatDate(request.appointment_date)}</div>
                          <div className="text-slate-600 dark:text-slate-400">à {formatTime(request.appointment_date)}</div>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="max-w-xs">
                          <p className="text-slate-900 dark:text-slate-100 font-medium truncate text-xs" title={request.reason_for_visit}>
                            {request.reason_for_visit}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                          {request.duration_minutes} min
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 font-medium text-xs px-1.5 py-0.5">
                          <ClockIcon className="w-2.5 h-2.5 mr-0.5" />
                          En attente
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 font-medium text-xs px-1.5 py-0.5">
                          <CreditCard className="w-2.5 h-2.5 mr-0.5" />
                          Non payé
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                          {request.consultation_fee} FCFA
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-center space-x-1">
                          {isPassed ? (
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-300 hover:scale-110 rounded-lg h-7 w-7 p-0"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 rounded-lg h-7 w-7 p-0"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleConfirm(request.id)}
                                disabled={confirmingId === request.id || cancellingId === request.id}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition-all duration-300 hover:scale-110 rounded-lg h-7 w-7 p-0"
                              >
                                {confirmingId === request.id ? (
                                  <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" />
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleCancel(request.id)}
                                disabled={confirmingId === request.id || cancellingId === request.id}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-300 hover:scale-110 rounded-lg h-7 w-7 p-0"
                              >
                                {cancellingId === request.id ? (
                                  <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <X className="w-3 h-3" />
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Modal pour afficher les détails de la demande de RDV */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto bg-white border-blue-200">
            <DialogHeader className="pb-2 bg-blue-50 -m-6 mb-4 p-4 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base font-semibold text-blue-900">Détails Demande</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-xs">
                    {selectedRequest?.patient?.first_name?.[0] || ''}{selectedRequest?.patient?.last_name?.[0] || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-blue-900 truncate">
                      {selectedRequest.patient?.first_name} {selectedRequest.patient?.last_name}
                    </h3>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-500" />
                      {selectedRequest.patient?.phone}
                    </p>
                  </div>
                </div>

                <Badge className="bg-orange-100 text-orange-800 border-orange-300" variant="outline">
                  En attente
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-blue-900">Date:</span>
                  <span className="text-gray-600">{new Date(selectedRequest.appointment_date).toLocaleDateString('fr-FR')}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-blue-900">Heure:</span>
                  <span className="text-gray-600">
                    {new Date(selectedRequest.appointment_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ({selectedRequest.duration_minutes}min)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-blue-900">Email:</span>
                  <span className="text-gray-600">{selectedRequest.patient?.email}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CreditCard className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium text-blue-900">Tarif:</span>
                  <span className="text-gray-600">{selectedRequest.consultation_fee} FCFA</span>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <FileText className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-blue-900">Motif:</span>
                  <span className="text-gray-600">{selectedRequest.reason_for_visit}</span>
                </div>
              </div>

              <Separator className="my-2 border-blue-200" />

              {/* Action Buttons - Avec textes */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    handleConfirm(selectedRequest.id)
                    setSelectedRequest(null)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 flex items-center gap-2 justify-center"
                >
                  <Check className="h-3 w-3" />
                  <span>Confirmer</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleCancel(selectedRequest.id)
                    setSelectedRequest(null)
                  }}
                  className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent text-xs px-3 py-2 flex items-center gap-2 justify-center"
                >
                  <X className="h-3 w-3" />
                  <span>Refuser</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent text-xs px-3 py-2 flex items-center gap-2 justify-center"
                >
                  <span>Fermer</span>
                </Button>
              </div>

              {/* Footer Note - Ultra Compact */}
              <div className="text-xs text-gray-500 text-center p-1 bg-gray-100 rounded text-[10px] border border-gray-200">
                Demande reçue • Réponse requise
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

export default function DoctorDashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [unreadMessages] = useState(12)
  const { requests, loading, error, refetch, confirmRequest, cancelRequest } = useAppointmentRequests()


  const [currentDate, setCurrentDate] = useState(new Date())

  // Protection de route : rediriger vers /login si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/doctor/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  // Ne pas afficher le contenu si non authentifié
  if (!isAuthenticated) {
    return null
  }



  const appointments = [
    {
      id: 1,
      patient: "Marie Ngono",
      time: "09:00",
      status: "confirmed",
      reason: "Consultation générale",
      phone: "+237 677 123 456",
    },
    {
      id: 2,
      patient: "Jean Mballa",
      time: "09:30",
      status: "waiting",
      reason: "Suivi hypertension",
      phone: "+237 655 789 012",
    },
    {
      id: 3,
      patient: "Fatima Alhadji",
      time: "10:00",
      status: "completed",
      reason: "Contrôle diabète",
      phone: "+237 699 345 678",
    },
    {
      id: 4,
      patient: "Paul Biya Jr",
      time: "10:30",
      status: "cancelled",
      reason: "Douleurs abdominales",
      phone: "+237 677 901 234",
    },
  ]

  const queue = [
    { id: 1, ticket: "A001", patient: "Marie Ngono", estimatedTime: "5 min", status: "current" },
    { id: 2, ticket: "A002", patient: "Jean Mballa", estimatedTime: "15 min", status: "waiting" },
    { id: 3, ticket: "A003", patient: "Fatima Alhadji", estimatedTime: "25 min", status: "waiting" },
  ]

  const stats = {
    todayAppointments: 12,
    confirmedAppointments: 8,
    waitingAppointments: 3,
    cancelledAppointments: 1,
    weeklyPresenceRate: 85,
    averageRating: 4.2,
  }

  const prescriptions = [
    {
      id: 1,
      patient: "Marie Ngono",
      date: "2024-01-15",
      medications: ["Paracétamol 500mg", "Amoxicilline 250mg"],
      status: "active",
    },
    {
      id: 2,
      patient: "Jean Mballa",
      date: "2024-01-14",
      medications: ["Metformine 850mg", "Lisinopril 10mg"],
      status: "completed",
    },
  ]

  const messages = [
    {
      id: 1,
      patient: "Marie Ngono",
      message: "Bonjour docteur, j'ai encore des douleurs...",
      time: "10:30",
      unread: true,
    },
    {
      id: 2,
      patient: "Jean Mballa",
      message: "Merci pour la consultation d'hier",
      time: "09:15",
      unread: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "no_show":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
      // Anciens statuts pour compatibilité
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "requested":
        return "Demandé"
      case "scheduled":
        return "Programmé"
      case "confirmed":
        return "Confirmé"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      case "no_show":
        return "Absent"
      // Anciens statuts pour compatibilité
      case "waiting":
        return "En attente"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-700 dark:text-white mb-1">
                How nonnn, Dr. {user?.name ? user.name.split(' ').slice(0, 2).join(' ') : 'Docteur'} 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Ça dit quoi, tu veux do quoi oday ?
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date().toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 p-2"
            >
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Aujourd'hui</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mt-1">{stats.todayAppointments}</p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Rendez-vous</p>
              </div>
              <div className="bg-emerald-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">Confirmés</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
                  {stats.confirmedAppointments}
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Patients</p>
              </div>
              <div className="bg-green-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Taux présence</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">{stats.weeklyPresenceRate}%</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Cette semaine</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Satisfaction</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{stats.averageRating}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-yellow-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">Note moyenne</p>
              </div>
              <div className="bg-yellow-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-700/50 p-3 mb-4">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs"
          >
            <Activity className="w-3 h-3" />
            <span>Vue d'ensemble</span>
          </Button>

          <Button
            variant={activeTab === 'appointments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('appointments')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs"
          >
            <Clock className="w-3 h-3" />
            <span>Mes Rendez-Vous</span>
          </Button>

          <div className="relative">
            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              onClick={() => setActiveTab('requests')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs"
            >
              <ClockArrowUp className="w-3 h-3" />
              <span>Demandes de RDV</span>
              {requests.length > 0 && (
                <div className="bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-md border-2 border-white shadow-sm">
                  {requests.length}
                </div>
              )}
            </Button>
          </div>

          <Button
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('calendar')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs"
          >
            <Calendar className="w-3 h-3" />
            <span>Calendrier</span>
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              disabled
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500"
            >
              <FileText className="w-3 h-3" />
              <span>Résultats d'analyse</span>
            </Button>
            <Badge className="absolute -top-2 -right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full border-2 border-white shadow-sm">
              Bientôt
            </Badge>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              disabled
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-600"
            >
              <HeartHandshake className="w-3 h-3" />
              <span>Visites médicales</span>
            </Button>
            <Badge className="absolute -top-2 -right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full border-2 border-white shadow-sm">
              Bientôt
            </Badge>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              disabled
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-300 text-xs opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500"
            >
              <Hospital className="w-3 h-3" />
              <span>Interventions spécialisées</span>
            </Button>
            <Badge className="absolute -top-2 -right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded-full border-2 border-white shadow-sm">
              Bientôt
            </Badge>
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Today's Queue */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">File d'attente du jour</h3>
                    <p className="text-emerald-100 text-xs mt-1">Gestion des patients en temps réel</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
                    {queue.length} patients
                  </Badge>
                  <Button size="sm" className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-3 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {queue.length > 0 ? (
                <div className="space-y-3">
                  {queue.map((item, index) => (
                    <div key={item.id} className="group relative">
                      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-xl border border-slate-200/60 dark:border-slate-600/60 p-4 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-600 transition-all duration-300 hover:scale-[1.01] group-hover:bg-gradient-to-r group-hover:from-emerald-50 group-hover:via-white group-hover:to-teal-50 dark:group-hover:from-emerald-900/20 dark:group-hover:via-slate-800 dark:group-hover:to-teal-900/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Position & Avatar */}
                            <div className="relative flex items-center space-x-3">
                              <div className="relative">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ring-2 transition-all duration-300 ${item.status === "current"
                                  ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 text-white ring-emerald-200 shadow-emerald-200"
                                  : "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-slate-700 ring-slate-200 shadow-slate-200"
                                  }`}>
                                  {item.ticket}
                                </div>
                                {item.status === "current" && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-md animate-pulse flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                                #{index + 1}
                              </div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.patient}</h4>
                                {item.status === "current" && (
                                  <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-700 dark:text-green-300 text-xs font-medium">En consultation</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-emerald-500" />
                                  <span className="font-medium">
                                    {item.status === "current" ? "Consultation en cours" : `Temps d'attente: ${item.estimatedTime}`}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-blue-500" />
                                  <span>Arrivé à 09:00</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Button variant="ghost" size="sm" className="hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg p-1">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg p-1">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                            <Badge className={`px-3 py-1 font-semibold text-xs rounded-lg shadow-sm ${item.status === "current"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                              : "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200"
                              }`}>
                              {item.status === "current" ? "🩺 En consultation" : "⏳ En attente"}
                            </Badge>
                          </div>
                        </div>

                        {/* Progress Bar for Current Patient */}
                        {item.status === "current" && (
                          <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-800">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Progression de la consultation</span>
                              <span className="text-xs text-emerald-600 dark:text-emerald-400">65%</span>
                            </div>
                            <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5">
                              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">File d'attente vide</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Aucun patient n'est actuellement en attente</p>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un patient
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="space-y-3">
          {/* Enhanced Header with Stats */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg p-3 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-0.5">Gestion des Rendez-vous</h2>
                  <p className="text-blue-100 text-xs">Suivez et gérez vos rendez-vous avec vos patients</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Nouveau RDV
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          {/* <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Période:</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Aujourd'hui
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-slate-700 border-slate-300 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Cette semaine
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-slate-700 border-slate-300 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Ce mois
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Statut:</span>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-52 border-slate-300 hover:border-purple-400 transition-colors duration-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🔍 Tous les statuts</SelectItem>
                      <SelectItem value="confirmed">✅ Confirmés</SelectItem>
                      <SelectItem value="waiting">⏳ En attente</SelectItem>
                      <SelectItem value="completed">🎉 Terminés</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Rechercher un patient..."
                      className="w-64 border-slate-300 hover:border-blue-400 focus:border-blue-500 transition-colors duration-200 rounded-xl"
                    />
                    <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-slate-600 rounded-xl">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Section Rendez-vous du jour */}
          <TodayAppointmentsTable router={router} />

          {/* Section Prochains Rendez-vous */}
          <UpcomingAppointmentsTable router={router} />
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-3">
          {/* Enhanced Header with Stats */}
          <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 rounded-lg p-3 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-0.5">Demandes de Rendez-vous</h2>
                  <p className="text-orange-100 text-xs">Gérez les nouvelles demandes de vos patients</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 text-xs" onClick={refetch}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Section Demandes de Rendez-vous */}
          <AppointmentRequestsTable router={router} />
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-4 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold">
                  <Calendar className="w-3 h-3 mr-2" />
                  Aujourd'hui
                </Button>
                <Button className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau créneau
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-purple-100 text-xs">Consultations</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-purple-100 text-xs">Urgences</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-purple-100 text-xs">Suivis</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="border-0 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {/* Days of week */}
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                  <div key={day} className="text-center font-bold text-slate-700 dark:text-slate-300 p-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg mb-1">
                    <div className="text-xs">{day}</div>
                  </div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Adjust for starting day
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const hasAppointments = isCurrentMonth && date.getDate() % 3 === 0;
                  const hasUrgency = isCurrentMonth && date.getDate() % 6 === 0;
                  const hasFollowUp = isCurrentMonth && date.getDate() % 4 === 0;

                  return (
                    <div
                      key={i}
                      className={`group relative p-2 text-center cursor-pointer rounded-lg transition-all duration-300 hover:scale-105 min-h-[70px] ${isToday
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg ring-2 ring-blue-200'
                        : isCurrentMonth
                          ? 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-600'
                          : 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-900'
                        }`}
                    >
                      <div className={`font-bold text-sm mb-1 ${isToday ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                        {date.getDate()}
                      </div>

                      {/* Appointments indicators */}
                      {isCurrentMonth && (
                        <div className="space-y-0.5">
                          {hasAppointments && (
                            <div className="group-hover:scale-110 transition-transform duration-200">
                              <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm"></div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">3 RDV</div>
                            </div>
                          )}
                          {hasUrgency && (
                            <div className="group-hover:scale-110 transition-transform duration-200">
                              <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-sm"></div>
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">Urgence</div>
                            </div>
                          )}
                          {hasFollowUp && (
                            <div className="group-hover:scale-110 transition-transform duration-200">
                              <div className="w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-sm"></div>
                              <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Suivi</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hover effect */}
                      {isCurrentMonth && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-3 text-center">
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">24</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-xs">RDV ce mois</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-3 text-center">
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200">3h 45m</h3>
                <p className="text-green-600 dark:text-green-400 font-medium text-xs">Temps libre aujourd'hui</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-3 text-center">
                <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">92%</h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium text-xs">Taux d'occupation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
