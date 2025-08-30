"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Clock,
  ArrowLeft
} from "lucide-react"

interface Patient {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  dateNaissance: string
  adresse: string
  dernierRdv: string
  prochainRdv?: string
  statut: 'actif' | 'inactif' | 'nouveau'
  avatar?: string
}

const mockPatients: Patient[] = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@email.com",
    telephone: "+33 6 12 34 56 78",
    dateNaissance: "1985-03-15",
    adresse: "123 Rue de la Paix, Paris",
    dernierRdv: "2024-01-10",
    prochainRdv: "2024-01-25",
    statut: "actif"
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Jean",
    email: "jean.martin@email.com",
    telephone: "+33 6 98 76 54 32",
    dateNaissance: "1978-07-22",
    adresse: "456 Avenue des Champs, Lyon",
    dernierRdv: "2024-01-08",
    statut: "actif"
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@email.com",
    telephone: "+33 6 11 22 33 44",
    dateNaissance: "1992-11-03",
    adresse: "789 Boulevard Saint-Michel, Marseille",
    dernierRdv: "2023-12-20",
    prochainRdv: "2024-01-30",
    statut: "nouveau"
  }
]

export default function PatientsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("tous")

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

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "tous" || patient.statut === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800 border-green-200'
      case 'nouveau': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inactif': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateAge = (dateNaissance: string) => {
    const today = new Date()
    const birthDate = new Date(dateNaissance)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                <Users className="w-8 h-8 text-emerald-600" />
                <span>Gestion des Patients</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gérez vos patients et leurs informations
              </p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Patient
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="nouveau">Nouveaux</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-xl transition-all duration-300 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {patient.prenom[0]}{patient.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {patient.prenom} {patient.nom}
                      </CardTitle>
                      <CardDescription>
                        {calculateAge(patient.dateNaissance)} ans
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(patient.statut)}>
                    {patient.statut}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>{patient.telephone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{patient.adresse}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Dernier RDV: {new Date(patient.dernierRdv).toLocaleDateString('fr-FR')}</span>
                </div>
                {patient.prochainRdv && (
                  <div className="flex items-center space-x-2 text-sm text-emerald-600">
                    <Calendar className="w-4 h-4" />
                    <span>Prochain RDV: {new Date(patient.prochainRdv).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                <div className="flex space-x-2 pt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    Voir Profil
                  </Button>
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Nouveau RDV
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Aucun patient trouvé
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}