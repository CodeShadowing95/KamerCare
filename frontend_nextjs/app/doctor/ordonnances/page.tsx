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
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Calendar,
  User,
  Pill,
  Clock,
  Download,
  Eye,
  Edit,
  ArrowLeft
} from "lucide-react"

interface Medicament {
  nom: string
  dosage: string
  frequence: string
  duree: string
  instructions?: string
}

interface Ordonnance {
  id: number
  patientId: number
  patientNom: string
  patientPrenom: string
  dateCreation: string
  dateValidite: string
  medicaments: Medicament[]
  statut: 'active' | 'expiree' | 'utilisee'
  notes?: string
  avatar?: string
}

const mockOrdonnances: Ordonnance[] = [
  {
    id: 1,
    patientId: 1,
    patientNom: "Dupont",
    patientPrenom: "Marie",
    dateCreation: "2024-01-15",
    dateValidite: "2024-04-15",
    statut: "active",
    medicaments: [
      {
        nom: "Paracétamol",
        dosage: "500mg",
        frequence: "3 fois par jour",
        duree: "7 jours",
        instructions: "À prendre après les repas"
      },
      {
        nom: "Ibuprofène",
        dosage: "200mg",
        frequence: "2 fois par jour",
        duree: "5 jours",
        instructions: "En cas de douleur"
      }
    ],
    notes: "Revoir le patient dans une semaine si les symptômes persistent."
  },
  {
    id: 2,
    patientId: 2,
    patientNom: "Martin",
    patientPrenom: "Jean",
    dateCreation: "2024-01-10",
    dateValidite: "2024-07-10",
    statut: "active",
    medicaments: [
      {
        nom: "Lisinopril",
        dosage: "10mg",
        frequence: "1 fois par jour",
        duree: "6 mois",
        instructions: "Le matin à jeun"
      },
      {
        nom: "Amlodipine",
        dosage: "5mg",
        frequence: "1 fois par jour",
        duree: "6 mois",
        instructions: "Le soir"
      }
    ],
    notes: "Contrôle de la tension artérielle mensuel recommandé."
  },
  {
    id: 3,
    patientId: 3,
    patientNom: "Bernard",
    patientPrenom: "Sophie",
    dateCreation: "2024-01-05",
    dateValidite: "2024-01-05",
    statut: "expiree",
    medicaments: [
      {
        nom: "Amoxicilline",
        dosage: "1g",
        frequence: "2 fois par jour",
        duree: "10 jours",
        instructions: "Avec un verre d'eau"
      }
    ],
    notes: "Traitement antibiotique terminé."
  },
  {
    id: 4,
    patientId: 1,
    patientNom: "Dupont",
    patientPrenom: "Marie",
    dateCreation: "2023-12-20",
    dateValidite: "2023-12-30",
    statut: "utilisee",
    medicaments: [
      {
        nom: "Doliprane",
        dosage: "1g",
        frequence: "3 fois par jour",
        duree: "3 jours",
        instructions: "En cas de fièvre"
      }
    ]
  }
]

export default function OrdonnancesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>(mockOrdonnances)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("toutes")
  const [selectedOrdonnance, setSelectedOrdonnance] = useState<Ordonnance | null>(null)

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

  const filteredOrdonnances = ordonnances.filter(ordonnance => {
    const matchesSearch = 
      ordonnance.patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordonnance.patientPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordonnance.medicaments.some(med => med.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === "toutes" || ordonnance.statut === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'expiree': return 'bg-red-100 text-red-800 border-red-200'
      case 'utilisee': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'active': return 'Active'
      case 'expiree': return 'Expirée'
      case 'utilisee': return 'Utilisée'
      default: return statut
    }
  }

  const isExpiringSoon = (dateValidite: string) => {
    const today = new Date()
    const validityDate = new Date(dateValidite)
    const diffInDays = (validityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 30 && diffInDays > 0
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
                <FileText className="w-8 h-8 text-emerald-600" />
                <span>Ordonnances</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gérez les prescriptions de vos patients
              </p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Ordonnance
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par patient ou médicament..."
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
                <option value="toutes">Toutes les ordonnances</option>
                <option value="active">Actives</option>
                <option value="expiree">Expirées</option>
                <option value="utilisee">Utilisées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{ordonnances.length}</p>
                </div>
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Actives</p>
                  <p className="text-2xl font-bold text-green-600">
                    {ordonnances.filter(o => o.statut === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Pill className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expirées</p>
                  <p className="text-2xl font-bold text-red-600">
                    {ordonnances.filter(o => o.statut === 'expiree').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expirent bientôt</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {ordonnances.filter(o => isExpiringSoon(o.dateValidite)).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ordonnances List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrdonnances.map((ordonnance) => (
            <Card key={ordonnance.id} className="hover:shadow-xl transition-all duration-300 border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={ordonnance.avatar} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {ordonnance.patientPrenom[0]}{ordonnance.patientNom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {ordonnance.patientPrenom} {ordonnance.patientNom}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ordonnance.dateCreation).toLocaleDateString('fr-FR')}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(ordonnance.statut)}>
                      {getStatusText(ordonnance.statut)}
                    </Badge>
                    {isExpiringSoon(ordonnance.dateValidite) && ordonnance.statut === 'active' && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Expire bientôt
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Pill className="w-4 h-4" />
                    <span>Médicaments ({ordonnance.medicaments.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {ordonnance.medicaments.slice(0, 2).map((medicament, index) => (
                      <div key={index} className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">{medicament.nom}</span> - {medicament.dosage} - {medicament.frequence}
                      </div>
                    ))}
                    {ordonnance.medicaments.length > 2 && (
                      <div className="text-sm text-slate-500">
                        +{ordonnance.medicaments.length - 2} autre(s) médicament(s)
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Valide jusqu'au {new Date(ordonnance.dateValidite).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {ordonnance.notes && (
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Notes:</span> {ordonnance.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedOrdonnance(ordonnance)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir Détails
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrdonnances.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Aucune ordonnance trouvée
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Modal de détails d'ordonnance */}
      {selectedOrdonnance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Détails de l'ordonnance #{selectedOrdonnance.id}
                </h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedOrdonnance(null)}
                >
                  Fermer
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {selectedOrdonnance.patientPrenom[0]}{selectedOrdonnance.patientNom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedOrdonnance.patientPrenom} {selectedOrdonnance.patientNom}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Créée le {new Date(selectedOrdonnance.dateCreation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Pill className="w-5 h-5" />
                    <span>Médicaments prescrits</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedOrdonnance.medicaments.map((medicament, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="font-medium text-slate-900 dark:text-white mb-2">
                          {medicament.nom} - {medicament.dosage}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div>
                            <span className="font-medium">Fréquence:</span> {medicament.frequence}
                          </div>
                          <div>
                            <span className="font-medium">Durée:</span> {medicament.duree}
                          </div>
                        </div>
                        {medicament.instructions && (
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Instructions:</span> {medicament.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrdonnance.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Notes du médecin</h4>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <p className="text-slate-600 dark:text-slate-400">{selectedOrdonnance.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Valide jusqu'au {new Date(selectedOrdonnance.dateValidite).toLocaleDateString('fr-FR')}
                  </div>
                  <Badge className={getStatusColor(selectedOrdonnance.statut)}>
                    {getStatusText(selectedOrdonnance.statut)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}