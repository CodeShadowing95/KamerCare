"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, MapPin, Stethoscope, User, Activity } from 'lucide-react'
import React, { useState } from 'react'

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

const HistoryPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)


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
  
  const completedAppointments = appointments.filter(apt => 
    apt.status === 'completed'
  )

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-600" />
              Historique des consultations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Consultez l'historique de toutes vos consultations terminées</p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedAppointments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consultations terminées</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(completedAppointments.map(apt => apt.specialty)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Spécialités consultées</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(completedAppointments.map(apt => apt.doctor)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Médecins consultés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des consultations */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Consultations récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment, index) => (
              <Card key={appointment.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <CardContent className="p-5">
                  {/* En-tête compact */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                      {appointment.doctor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                        {appointment.doctor}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Informations essentielles */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Calendar className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(appointment.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <Clock className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <MapPin className="w-3 h-3 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{appointment.hospital}</span>
                    </div>
                  </div>

                  {/* Motif de consultation compact */}
                  {appointment.reason && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-2 mb-3 border border-green-100 dark:border-green-800">
                      <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                        <span className="font-medium text-green-600 dark:text-green-400">Motif:</span> {appointment.reason}
                      </p>
                    </div>
                  )}

                  {/* Badge de statut et actions */}
                  <div className="flex items-center justify-between">
                    <div className="scale-75 origin-left">
                      {getStatusBadge(appointment.status)}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:bg-green-50 hover:text-green-700 transition-colors">
                      <FileText className="w-3 h-3 mr-1" />
                      Rapport
                    </Button>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                      <span className="capitalize">{appointment.type}</span>
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucune consultation terminée</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Vous n'avez pas encore de consultations terminées dans votre historique. 
                Vos futures consultations apparaîtront ici une fois terminées.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-md mx-auto border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Vos consultations futures apparaîtront automatiquement ici</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage