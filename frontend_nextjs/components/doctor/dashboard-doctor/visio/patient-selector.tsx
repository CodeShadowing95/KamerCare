"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Video, Clock, AlertCircle, User, Users, X, ChevronRight, ChevronDown, Info, Calendar } from "lucide-react"

const mockPatients = [
  {
    id: 1,
    name: "Marie Dupont",
    age: 45,
    condition: "Consultation de suivi",
    lastVisit: "2024-01-15",
    priority: "routine",
    avatar: "/woman-patient.jpg",
    status: "online",
    allergies: ["Pénicilline", "Aspirine"],
    referringDoctor: "Dr. Leblanc"
  },
  {
    id: 2,
    name: "Jean Martin",
    age: 62,
    condition: "Contrôle diabète",
    lastVisit: "2024-01-10",
    priority: "urgent",
    avatar: "/man-patient.jpg",
    status: "online",
    allergies: ["Iode"],
    referringDoctor: null
  },
  {
    id: 3,
    name: "Sophie Bernard",
    age: 28,
    condition: "Consultation prénatale",
    lastVisit: "2024-01-12",
    priority: "suivi",
    avatar: "/placeholder-055dx.png",
    status: "away",
    allergies: [],
    referringDoctor: "Dr. Rousseau"
  },
  {
    id: 4,
    name: "Pierre Moreau",
    age: 55,
    condition: "Suivi cardiologique",
    lastVisit: "2024-01-08",
    priority: "urgent",
    avatar: "/older-man-patient.jpg",
    status: "online",
    allergies: ["Pénicilline", "Latex", "Fruits de mer"],
    referringDoctor: "Dr. Cardiologue"
  },
  {
    id: 5,
    name: "Emma Leroy",
    age: 34,
    condition: "Consultation générale",
    lastVisit: "2024-01-14",
    priority: "routine",
    avatar: "/placeholder-fc5si.png",
    status: "online",
    allergies: ["Pollen"],
    referringDoctor: null
  },
]

interface PatientSelectorProps {
  selectedPatient: any
  onSelectPatient: (patient: any) => void
  onStartCall: (patient: any) => void
  disabled?: boolean
  callReason: string
  onCallReasonChange: (reason: string) => void
}

export function PatientSelector({
  selectedPatient,
  onSelectPatient,
  onStartCall,
  disabled = false,
  callReason,
  onCallReasonChange,
}: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedPatients, setExpandedPatients] = useState<Set<number>>(new Set())

  const toggleExpanded = (patientId: number) => {
    const newExpanded = new Set(expandedPatients)
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId)
    } else {
      newExpanded.add(patientId)
    }
    setExpandedPatients(newExpanded)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Consulté(e) hier"
    if (diffDays < 7) return `Consulté(e) il y a ${diffDays} jours`
    if (diffDays < 30) return `Consulté(e) il y a ${Math.ceil(diffDays / 7)} semaine${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`
    return `Consulté(e) il y a ${Math.ceil(diffDays / 30)} mois`
  }

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400"
      case "suivi":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
      case "routine":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-400"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent"
      case "suivi":
        return "Suivi"
      case "routine":
        return "Routine"
      default:
        return "Normal"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-sm animate-fade-in">
      {/* Header avec statistiques */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 animate-slide-down">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Patients disponibles ({filteredPatients.length})</span>
          </h2>
          {/* <div className="flex items-center space-x-2 px-3 py-1 bg-white/80 rounded-full shadow-sm transition-smooth hover-lift">
            <div className="w-2 h-2 bg-green-500 rounded-full shrink-0 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">{filteredPatients.length}</span>
          </div> */}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/60 rounded-lg transition-smooth hover-lift card-interactive">
            <div className="text-lg font-bold text-blue-600">{mockPatients.filter(p => p.status === 'available').length}</div>
            <div className="text-xs text-gray-600">Disponibles</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg transition-smooth hover-lift card-interactive">
            <div className="text-lg font-bold text-orange-600">{mockPatients.filter(p => p.status === 'busy').length}</div>
            <div className="text-xs text-gray-600">Occupés</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg transition-smooth hover-lift card-interactive">
            <div className="text-lg font-bold text-red-600">{mockPatients.filter(p => p.priority === 'urgent').length}</div>
            <div className="text-xs text-gray-600">Urgents</div>
          </div>
        </div>
      </div>

      {/* Barre de recherche améliorée */}
      <div className="p-4 border-b border-gray-100 animate-slide-up">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth hover-lift bg-gray-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-smooth"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Patient sélectionné */}
      {selectedPatient && (
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 animate-scale-in">
          <div className="flex items-center space-x-3 mb-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-blue-200 transition-bounce hover-lift">
                <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-base">
                  {selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedPatient.status)} animate-pulse`}></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">{selectedPatient.name}</h3>
              <p className="text-xs text-gray-600">{selectedPatient.age} ans • {selectedPatient.condition}</p>
            </div>
            <Badge variant={selectedPatient.priority === 'urgent' ? 'destructive' : 'secondary'} className="transition-bounce">
              {selectedPatient.priority === 'urgent' ? 'Urgent' : 'Normal'}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif de la consultation
              </label>
              <textarea
                value={callReason}
                onChange={(e) => onCallReasonChange(e.target.value)}
                placeholder="Décrivez brièvement le motif de la consultation..."
                className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-smooth hover-lift"
                rows={3}
              />
            </div>
            
            <div className="space-y-1">
              <Button 
                onClick={() => onStartCall(selectedPatient)}
                disabled={!callReason.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-medium py-3 rounded-lg transition-bounce hover-lift btn-gradient-shift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Video className="h-4 w-4" />
                Démarrer
              </Button>
              <Button
                onClick={() => onSelectPatient(null)}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-medium py-3 rounded-lg transition-bounce hover-lift btn-gradient-shift"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des patients */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 animate-fade-in">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className={`group transition-all duration-200 ease-in-out border border-gray-200 shadow-sm hover:shadow-md ${
                selectedPatient?.id === patient.id 
                  ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg' 
                  : 'hover:bg-gray-50/80 bg-white'
              }`}
              onClick={() => onSelectPatient(selectedPatient?.id === patient.id ? null : patient)}
            >
              <CardContent className="px-4">
                {/* En-tête de la carte avec informations principales */}
                <div className="flex items-start space-x-3">
                  {/* Avatar avec indicateur de statut */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                      <AvatarImage src={patient.avatar} alt={patient.name} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 font-semibold text-sm">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${getStatusColor(patient.status)} transition-all duration-200`}>
                      <div className={`w-full h-full rounded-full ${patient.status === 'online' ? 'animate-pulse' : ''}`}></div>
                    </div>
                  </div>
                  
                  {/* Informations patient principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                          {patient.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-600 font-medium">{patient.age} ans</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className={`text-xs font-medium text-gray-600 truncate ${getPriorityColor(patient.priority)} ${
                          patient.priority === 'urgent' ? 'animate-pulse' : ''
                        }`}>{getPriorityLabel(patient.priority)}</span>
                        </div>
                      </div>
                      
                      {/* Bouton détails optionnel */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpanded(patient.id)
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Dernière consultation */}
                    <div className="flex items-center text-[11px] italic text-gray-500">
                      <span>{getTimeAgo(patient.lastVisit)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Section détails expandable */}
                {expandedPatients.has(patient.id) && (
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    {/* Allergies majeures */}
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                          Allergies majeures
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map((allergy, index) => (
                            <Badge 
                              key={index}
                              variant="destructive"
                              className="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                            >
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Médecin traitant/référent */}
                    {patient.referringDoctor && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <User className="h-4 w-4 mr-1 text-blue-500" />
                          Médecin référent
                        </h4>
                        <p className="text-sm text-gray-600">{patient.referringDoctor}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {searchTerm 
                ? `Aucun patient ne correspond à "${searchTerm}". Essayez un autre terme de recherche.`
                : "Aucun patient n'est actuellement disponible pour une consultation."
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4 transition-bounce hover-lift"
              >
                Effacer la recherche
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
