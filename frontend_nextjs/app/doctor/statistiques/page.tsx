"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Download,
  Filter
} from "lucide-react"

interface StatistiqueCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
}

interface ChartData {
  name: string
  value: number
  color: string
}

const mockStatistiques: StatistiqueCard[] = [
  {
    title: "Patients Total",
    value: 247,
    change: 12,
    changeType: "increase",
    icon: <Users className="w-6 h-6" />,
    color: "text-blue-600"
  },
  {
    title: "RDV ce mois",
    value: 89,
    change: 8,
    changeType: "increase",
    icon: <Calendar className="w-6 h-6" />,
    color: "text-emerald-600"
  },
  {
    title: "Taux de présence",
    value: "92%",
    change: 3,
    changeType: "increase",
    icon: <Activity className="w-6 h-6" />,
    color: "text-green-600"
  },
  {
    title: "Revenus mensuel",
    value: "€12,450",
    change: 15,
    changeType: "increase",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-purple-600"
  },
  {
    title: "Temps moyen/consultation",
    value: "28 min",
    change: 2,
    changeType: "decrease",
    icon: <Clock className="w-6 h-6" />,
    color: "text-orange-600"
  },
  {
    title: "Nouveaux patients",
    value: 18,
    change: 5,
    changeType: "increase",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "text-indigo-600"
  }
]

const mockRendezVousData: ChartData[] = [
  { name: "Lun", value: 12, color: "bg-blue-500" },
  { name: "Mar", value: 15, color: "bg-emerald-500" },
  { name: "Mer", value: 8, color: "bg-purple-500" },
  { name: "Jeu", value: 18, color: "bg-orange-500" },
  { name: "Ven", value: 14, color: "bg-pink-500" },
  { name: "Sam", value: 6, color: "bg-indigo-500" },
  { name: "Dim", value: 3, color: "bg-gray-500" }
]

const mockSpecialitesData: ChartData[] = [
  { name: "Consultation générale", value: 45, color: "bg-blue-500" },
  { name: "Suivi chronique", value: 25, color: "bg-emerald-500" },
  { name: "Urgences", value: 15, color: "bg-red-500" },
  { name: "Examens préventifs", value: 10, color: "bg-purple-500" },
  { name: "Autres", value: 5, color: "bg-gray-500" }
]

const mockPatientsAge: ChartData[] = [
  { name: "0-18 ans", value: 15, color: "bg-blue-400" },
  { name: "19-35 ans", value: 25, color: "bg-emerald-400" },
  { name: "36-50 ans", value: 30, color: "bg-purple-400" },
  { name: "51-65 ans", value: 20, color: "bg-orange-400" },
  { name: "65+ ans", value: 10, color: "bg-red-400" }
]

export default function StatistiquesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Protection de route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const maxValue = Math.max(...mockRendezVousData.map(d => d.value))

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <span>Statistiques</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Analysez les performances de votre pratique
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockStatistiques.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}%
                      </span>
                      <span className="text-sm text-slate-500">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rendez-vous par jour */}
          <Card className="border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Rendez-vous par jour</span>
              </CardTitle>
              <CardDescription>Répartition des consultations cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRendezVousData.map((day, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {day.name}
                    </div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className={`h-full ${day.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(day.value / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-semibold text-slate-900 dark:text-white">
                      {day.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Types de consultations */}
          <Card className="border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Types de consultations</span>
              </CardTitle>
              <CardDescription>Répartition par spécialité ce mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSpecialitesData.map((specialite, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${specialite.color}`}></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {specialite.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {specialite.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition par âge */}
          <Card className="border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Répartition par âge</span>
              </CardTitle>
              <CardDescription>Profil démographique des patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPatientsAge.map((age, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {age.name}
                    </div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden">
                      <div 
                        className={`h-full ${age.color} rounded-full transition-all duration-500`}
                        style={{ width: `${age.value * 3}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-semibold text-slate-900 dark:text-white">
                      {age.value}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objectifs mensuels */}
          <Card className="border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Objectifs mensuels</span>
              </CardTitle>
              <CardDescription>Progression vers vos objectifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Consultations (89/100)
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">89%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: '89%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Revenus (€12,450/€15,000)
                    </span>
                    <span className="text-sm font-semibold text-blue-600">83%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: '83%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nouveaux patients (18/20)
                    </span>
                    <span className="text-sm font-semibold text-purple-600">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mt-8 border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Résumé des performances</span>
            </CardTitle>
            <CardDescription>Aperçu global de votre activité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600 mb-1">Excellent</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Taux de satisfaction</div>
                <div className="text-xs text-slate-500 mt-1">Basé sur 45 avis patients</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">+15%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Croissance mensuelle</div>
                <div className="text-xs text-slate-500 mt-1">Comparé au mois dernier</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">4.8/5</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Note moyenne</div>
                <div className="text-xs text-slate-500 mt-1">Évaluations patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}