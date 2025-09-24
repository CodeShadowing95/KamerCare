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
    totalAppointments: 0,
    activeHospitals: 0,
    totalUsers: 0,
    systemUptime: 0.0,
    dailyAppointments: 0,
    averageWaitTime: 0,
    noShowRate: 0.0,
    patientSatisfaction: 0.0,
  }

  const recentActivities = [
    { id: 1, action: "Nouveau rendez-vous créé", user: "Jean Mballa", time: "5 min", type: "appointment" },
    { id: 2, action: "Hôpital ajouté au système", user: "Admin System", time: "1h", type: "hospital" },
    { id: 3, action: "Utilisateur suspendu", user: "Admin Yaoundé", time: "2h", type: "user" },
    { id: 4, action: "Rapport mensuel généré", user: "System", time: "3h", type: "report" },
  ]

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
                      {/* <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+12%</span>
                      </div> */}
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
                      {/* <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+3</span>
                      </div> */}
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
                      {/* <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">+8%</span>
                      </div> */}
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
                      {/* <div className="flex items-center mt-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                        <span className="text-sm font-medium text-emerald-600">Excellent</span>
                      </div> */}
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
      </main>
    </>
  )
}
