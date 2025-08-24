"use client"

import { useState } from "react"
import {
  Calendar,
  Users,
  Clock,
  MessageSquare,
  Settings,
  Bell,
  Search,
  MoreHorizontal,
  CheckCircle,
  FileText,
  Eye,
  Edit,
  Plus,
  Star,
  Activity,
  TrendingUp,
  Filter,
  Download,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState(new Date())

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
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "waiting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé"
      case "waiting":
        return "En attente"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/caring-doctor.png" />
              <AvatarFallback className="bg-medical-primary text-white">DN</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Dr. Ngono</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Médecin généraliste</div>
              <div className="text-xs text-medical-primary font-medium">CHU Yaoundé</div>
            </div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "overview" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <Activity className="w-4 h-4 mr-3" />
            Tableau de bord
          </Button>
          <Button
            variant={activeTab === "appointments" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "appointments" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Mes rendez-vous
          </Button>
          <Button
            variant={activeTab === "calendar" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "calendar" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Calendrier
          </Button>
          <Button
            variant={activeTab === "queue" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "queue" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("queue")}
          >
            <Users className="w-4 h-4 mr-3" />
            File d'attente
          </Button>
          <Button
            variant={activeTab === "prescriptions" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "prescriptions" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("prescriptions")}
          >
            <FileText className="w-4 h-4 mr-3" />
            Prescriptions
          </Button>
          <Button
            variant={activeTab === "messages" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "messages" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Messages
            {messages.filter((m) => m.unread).length > 0 && (
              <Badge className="ml-auto bg-red-500 text-white text-xs">{messages.filter((m) => m.unread).length}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "settings" ? "bg-medical-primary/10 text-medical-primary" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-3" />
            Paramètres
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab === "overview" && "Tableau de bord"}
                {activeTab === "appointments" && "Mes rendez-vous"}
                {activeTab === "calendar" && "Calendrier"}
                {activeTab === "queue" && "File d'attente"}
                {activeTab === "prescriptions" && "Prescriptions"}
                {activeTab === "messages" && "Messages"}
                {activeTab === "settings" && "Paramètres"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input placeholder="Rechercher..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Aujourd'hui</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.todayAppointments}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-emerald-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Confirmés</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stats.confirmedAppointments}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Taux présence</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.weeklyPresenceRate}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Satisfaction</p>
                        <div className="flex items-center space-x-1">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</p>
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                      </div>
                      <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Queue */}
              <Card>
                <CardHeader>
                  <CardTitle>File d'attente du jour</CardTitle>
                  <CardDescription>Patients en attente de consultation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {queue.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                              item.status === "current"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {item.ticket}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{item.patient}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {item.status === "current" ? "En cours" : `Attente: ${item.estimatedTime}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.status === "current" && (
                            <Badge className="bg-emerald-100 text-emerald-800">En cours</Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="confirmed">Confirmés</SelectItem>
                      <SelectItem value="waiting">En attente</SelectItem>
                      <SelectItem value="completed">Terminés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau RDV
                </Button>
              </div>

              {/* Appointments Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Patient</th>
                          <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Heure</th>
                          <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Motif</th>
                          <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Statut</th>
                          <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>
                                    {appointment.patient
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white">{appointment.patient}</p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">{appointment.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-900 dark:text-white">{appointment.time}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-slate-900 dark:text-white">{appointment.reason}</p>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusText(appointment.status)}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">Janvier 2024</h2>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Aujourd'hui
                  </Button>
                  <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau créneau
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-4 mb-4">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                      <div key={day} className="text-center font-semibold text-slate-600 dark:text-slate-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 6 + 1
                      const hasAppointment = [8, 15, 22, 29].includes(day)
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex flex-col items-center justify-center rounded-lg border cursor-pointer transition-colors ${
                            day > 0 && day <= 31
                              ? hasAppointment
                                ? "bg-medical-primary/10 border-medical-primary text-medical-primary"
                                : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        >
                          {day > 0 && day <= 31 && (
                            <>
                              <span className="text-sm font-medium">{day}</span>
                              {hasAppointment && <div className="w-1 h-1 bg-medical-primary rounded-full mt-1"></div>}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="completed">Terminées</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle prescription
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {prescriptions.map((prescription) => (
                  <Card key={prescription.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {prescription.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{prescription.patient}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              Prescrite le {new Date(prescription.date).toLocaleDateString("fr-FR")}
                            </p>
                            <div className="space-y-2">
                              {prescription.medications.map((med, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-medical-primary rounded-full"></div>
                                  <span className="text-sm">{med}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              prescription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {prescription.status === "active" ? "Active" : "Terminée"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input placeholder="Rechercher..." className="pl-10" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border-l-4 ${
                            message.unread ? "border-medical-primary bg-medical-primary/5" : "border-transparent"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {message.patient
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p
                                  className={`font-medium truncate ${message.unread ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}
                                >
                                  {message.patient}
                                </p>
                                <span className="text-xs text-slate-500">{message.time}</span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{message.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>MN</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">Marie Ngono</CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">En ligne</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-96">
                    <div className="flex-1 space-y-4 mb-4">
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 max-w-xs">
                          <p className="text-sm">
                            Bonjour docteur, j'ai encore des douleurs au niveau de l'estomac depuis hier soir.
                          </p>
                          <span className="text-xs text-slate-500 mt-1 block">10:30</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-medical-primary text-white rounded-lg p-3 max-w-xs">
                          <p className="text-sm">Bonjour Marie. Pouvez-vous me décrire plus précisément la douleur ?</p>
                          <span className="text-xs text-medical-primary/70 mt-1 block">10:32</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Textarea placeholder="Tapez votre message..." className="flex-1 min-h-[40px] max-h-[100px]" />
                      <Button size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>File d'attente en temps réel</CardTitle>
                  <CardDescription>Gérez l'ordre de passage de vos patients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {queue.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold text-slate-400">#{index + 1}</div>
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                              item.status === "current"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {item.ticket}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-lg">{item.patient}</p>
                            <p className="text-slate-600 dark:text-slate-400">
                              {item.status === "current"
                                ? "En consultation"
                                : `Temps d'attente estimé: ${item.estimatedTime}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.status === "current" ? (
                            <Button className="bg-emerald-600 hover:bg-emerald-700">Terminer consultation</Button>
                          ) : (
                            <Button variant="outline">Appeler patient</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs content would go here */}
        </main>
      </div>
    </div>
  )
}
