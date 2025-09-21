"use client"

import { useState, useRef, useEffect } from "react"
import {
  BarChart3,
  Users,
  Building2,
  Settings,
  Shield,
  FileText,
  Download,
  Search,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Activity,
  MapPin,
  CheckCircle,
  Calendar,
  DollarSign,
  Database,
  Bell,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import ContentHeader from "@/components/admin/content-header"

export default function AdminDashboard() {
  const router = useRouter()
  
  // Vérification de l'authentification et redirection basée sur le rôle
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userDataString = localStorage.getItem('user')
    
    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        const userRole = userData?.role
        
        // Redirection basée sur le rôle
        if (userRole === 'doctor') {
          router.push('/doctor')
        } else if (userRole === 'admin') {
          router.push('/admin')
        }
        // Si le rôle est 'patient' ou autre, rester sur la page d'accueil
      } catch (error) {
        console.error('Erreur lors de la lecture des données utilisateur:', error)
        // En cas d'erreur, nettoyer le localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Redirection vers la page de connexion
        router.push('/login')
      }
    }
  }, [])

  const [activeTab, setActiveTab] = useState("overview")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const stats = {
    totalAppointments: 15420,
    activeHospitals: 45,
    totalUsers: 8932,
    systemUptime: 99.8,
    dailyAppointments: 342,
    averageWaitTime: 18,
    noShowRate: 12.5,
    patientSatisfaction: 4.3,
  }

  const hospitals = [
    {
      id: 1,
      name: "Hôpital Central de Yaoundé",
      region: "Centre",
      city: "Yaoundé",
      capacity: 500,
      status: "active",
      appointments: 45,
      occupancy: 78,
    },
    {
      id: 2,
      name: "Hôpital Laquintinie",
      region: "Littoral",
      city: "Douala",
      capacity: 400,
      status: "active",
      appointments: 38,
      occupancy: 65,
    },
    {
      id: 3,
      name: "Hôpital Régional de Bafoussam",
      region: "Ouest",
      city: "Bafoussam",
      capacity: 200,
      status: "maintenance",
      appointments: 0,
      occupancy: 0,
    },
  ]

  const roles = [
    { id: 1, name: "Super Admin", users: 2, permissions: ["all"], description: "Accès complet au système" },
    {
      id: 2,
      name: "Admin Régional",
      users: 8,
      permissions: ["hospitals", "users", "reports"],
      description: "Gestion régionale",
    },
    { id: 3, name: "Médecin", users: 156, permissions: ["appointments", "patients"], description: "Praticien médical" },
    { id: 4, name: "Patient", users: 8766, permissions: ["appointments"], description: "Utilisateur final" },
  ]

  const specialties = [
    { id: 1, name: "Cardiologie", doctors: 23, appointments: 145, avgWait: 15 },
    { id: 2, name: "Pédiatrie", doctors: 18, appointments: 98, avgWait: 12 },
    { id: 3, name: "Gynécologie", doctors: 15, appointments: 87, avgWait: 18 },
    { id: 4, name: "Orthopédie", doctors: 12, appointments: 76, avgWait: 22 },
    { id: 5, name: "Dermatologie", doctors: 8, appointments: 54, avgWait: 10 },
  ]

  const payments = [
    { id: 1, hospital: "Hôpital Central", amount: 2450000, status: "paid", date: "2024-01-15", type: "monthly" },
    { id: 2, hospital: "Hôpital Laquintinie", amount: 1890000, status: "pending", date: "2024-01-14", type: "monthly" },
    { id: 3, hospital: "CHU Yaoundé", amount: 3200000, status: "paid", date: "2024-01-13", type: "monthly" },
  ]

  const recentActivities = [
    { id: 1, action: "Nouveau rendez-vous créé", user: "Jean Mballa", time: "5 min", type: "appointment" },
    { id: 2, action: "Hôpital ajouté au système", user: "Admin System", time: "1h", type: "hospital" },
    { id: 3, action: "Utilisateur suspendu", user: "Admin Yaoundé", time: "2h", type: "user" },
    { id: 4, action: "Rapport mensuel généré", user: "System", time: "3h", type: "report" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  return (
    <>
      {/* Top Bar avec dégradé élégant */}
      <ContentHeader title="Vue d'ensemble" subtitle="Système national de prise de rendez-vous médicaux" />

      {/* Content */}
      <main className="p-8 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-50/10 dark:from-transparent dark:via-slate-800/20 dark:to-slate-900/10 min-h-screen">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">RDV Total</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {stats.totalAppointments.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+12%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Hôpitaux Actifs</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stats.activeHospitals}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+3</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Utilisateurs</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stats.totalUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+8%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Disponibilité</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats.systemUptime}%</p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">Excellent</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Métriques de performance
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Indicateurs clés du système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">RDV quotidiens</span>
                      <span className="font-bold text-blue-700 dark:text-blue-300">{stats.dailyAppointments}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-700/50 dark:to-slate-600/50">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Temps d'attente moyen</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">
                        {stats.averageWaitTime} min
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700/50 dark:to-slate-600/50">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Taux d'absence</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">{stats.noShowRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700/50 dark:to-slate-600/50">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">Satisfaction patients</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {stats.patientSatisfaction}/5
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Activité récente
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Dernières actions système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-700/30 dark:to-slate-600/20 hover:from-slate-100/70 hover:to-slate-200/50 dark:hover:from-slate-700/50 dark:hover:to-slate-600/40 transition-all duration-200">
                        <div
                          className={`w-3 h-3 rounded-full shadow-sm ${activity.type === "appointment"
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                              : activity.type === "hospital"
                                ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                : activity.type === "user"
                                  ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                  : "bg-gradient-to-r from-purple-400 to-purple-600"
                            }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{activity.action}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            par {activity.user} • il y a {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Heatmap Placeholder */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Carte de chaleur par région
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Utilisation du système par région
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-slate-100/50 to-slate-200/30 dark:from-slate-700/30 dark:to-slate-800/50 rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-slate-600/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">Carte interactive du Cameroun</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Données de géolocalisation en temps réel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "hospitals" && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Rechercher un hôpital..." className="pl-10 w-64" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les régions</SelectItem>
                    <SelectItem value="centre">Centre</SelectItem>
                    <SelectItem value="littoral">Littoral</SelectItem>
                    <SelectItem value="ouest">Ouest</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter hôpital
              </Button>
            </div>

            {/* Hospitals Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Hôpital</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Localisation</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Capacité</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                          RDV Aujourd'hui
                        </th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Occupation</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Statut</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitals.map((hospital) => (
                        <tr key={hospital.id} className="border-t border-slate-200 dark:border-slate-700">
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{hospital.name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">ID: {hospital.id}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-900 dark:text-white">
                                {hospital.city}, {hospital.region}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{hospital.capacity} lits</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{hospital.appointments}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ width: `${hospital.occupancy}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {hospital.occupancy}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(hospital.status)}>
                              {getStatusText(hospital.status)}
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
                                <Settings className="w-4 h-4" />
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

        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Rechercher un rôle..." className="pl-10 w-64" />
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau rôle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-sans">{role.name}</span>
                      <Badge variant="outline">{role.users} utilisateurs</Badge>
                    </CardTitle>
                    <CardDescription className="font-serif">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "specialties" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Rechercher une spécialité..." className="pl-10 w-64" />
                </div>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle spécialité
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Spécialité</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Médecins</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">RDV ce mois</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                          Temps d'attente moyen
                        </th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specialties.map((specialty) => (
                        <tr key={specialty.id} className="border-t border-slate-200 dark:border-slate-700">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-4 h-4 text-emerald-600" />
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-white">{specialty.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{specialty.doctors}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{specialty.appointments}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{specialty.avgWait} min</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
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

        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Revenus ce mois</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">7,540,000 FCFA</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">+15%</span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Paiements en attente</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">1,890,000 FCFA</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-yellow-600">3 hôpitaux</span>
                      </div>
                    </div>
                    <Calendar className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Taux de recouvrement</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">94.2%</p>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">Excellent</span>
                      </div>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Transactions récentes</CardTitle>
                <CardDescription className="font-serif">Paiements des hôpitaux partenaires</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Hôpital</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Montant</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Type</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Date</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Statut</th>
                        <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-t border-slate-200 dark:border-slate-700">
                          <td className="p-4">
                            <span className="font-semibold text-slate-900 dark:text-white">{payment.hospital}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">
                              {payment.amount.toLocaleString()} FCFA
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{payment.type === "monthly" ? "Mensuel" : payment.type}</Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-900 dark:text-white">{payment.date}</span>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {payment.status === "paid" ? "Payé" : "En attente"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
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

        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="font-sans">Pages d'information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">
                    Gérer les contenus informatifs du site
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span className="font-sans">Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">
                    Configurer les messages système
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="font-sans">Données géographiques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">
                    Régions, villes et localisations
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Database className="w-4 h-4 mr-2" />
                    Gérer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les logs</SelectItem>
                    <SelectItem value="error">Erreurs</SelectItem>
                    <SelectItem value="warning">Avertissements</SelectItem>
                    <SelectItem value="info">Informations</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" className="w-40" />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter logs
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Journaux système</CardTitle>
                <CardDescription className="font-serif">Activité et événements du système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${activity.type === "appointment"
                              ? "bg-green-500"
                              : activity.type === "hospital"
                                ? "bg-blue-500"
                                : activity.type === "user"
                                  ? "bg-yellow-500"
                                  : "bg-purple-500"
                            }`}
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">par {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-500">il y a {activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span className="font-sans">Rapport mensuel</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">Statistiques complètes du mois</p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4 h-4 mr-2" />
                    Générer PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-sans">Rapport utilisateurs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">
                    Analyse des utilisateurs actifs
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Générer Excel
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="font-sans">Rapport hôpitaux</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 font-serif mb-4">Performance par établissement</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Générer CSV
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Analytics en temps réel</CardTitle>
                <CardDescription className="font-serif">Métriques de performance du système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-400">Graphiques interactifs</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">Données de performance en temps réel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  )
}
