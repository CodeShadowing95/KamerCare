"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, AlertCircle, Calendar, Clock, Edit, FileText, Heart, MapPin, Search, Stethoscope, Loader2, Grid3X3, List, Table, CreditCard, X, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useAppointments } from '@/hooks/use-appointments'
import { useRouter } from 'next/navigation'
import { DoctorSpecialization } from '@/components/ui/doctor-specialization'

const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'cards' | 'grid' | 'table'>('cards')
  const { appointments, loading, error, refetch } = useAppointments()
  const router = useRouter()

  const handlePayment = (appointmentId: number) => {
    router.push(`/reglement?appointment=${appointmentId}`)
  }

  const filteredAppointments = appointments.filter(apt => {
    const doctorName = `${apt.doctor.first_name} ${apt.doctor.last_name}`
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reason_for_visit.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Regrouper les rendez-vous par docteur pour la vue grid
  const groupedAppointments = filteredAppointments.reduce((acc, appointment) => {
    const doctorKey = `${appointment.doctor.id}-${appointment.doctor.first_name}-${appointment.doctor.last_name}`
    if (!acc[doctorKey]) {
      acc[doctorKey] = {
        doctor: appointment.doctor,
        appointments: []
      }
    }
    acc[doctorKey].appointments.push(appointment)
    return acc
  }, {} as Record<string, { doctor: any, appointments: any[] }>)

  const doctorGroups = Object.values(groupedAppointments)

  const getStatusBadge = (status: string) => {
    const variants = {
      requested: 'bg-gradient-to-r from-amber-100/80 to-orange-100/80 text-amber-700 border-amber-200/50 shadow-sm shadow-amber-500/10',
      scheduled: 'bg-gradient-to-r from-blue-100/80 to-sky-100/80 text-blue-700 border-blue-200/50 shadow-sm shadow-blue-500/10',
      confirmed: 'bg-gradient-to-r from-emerald-100/80 to-green-100/80 text-emerald-700 border-emerald-200/50 shadow-sm shadow-emerald-500/10',
      in_progress: 'bg-gradient-to-r from-purple-100/80 to-indigo-100/80 text-purple-700 border-purple-200/50 shadow-sm shadow-purple-500/10',
      completed: 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 text-green-700 border-green-200/50 shadow-sm shadow-green-500/10',
      cancelled: 'bg-gradient-to-r from-red-100/80 to-rose-100/80 text-red-700 border-red-200/50 shadow-sm shadow-red-500/10',
      no_show: 'bg-gradient-to-r from-gray-100/80 to-slate-100/80 text-gray-700 border-gray-200/50 shadow-sm shadow-gray-500/10'
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
      <Badge className={`${variants[status as keyof typeof variants]} border text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentiel':
        return <Stethoscope className="w-4 h-4" />
      case 'visio':
        return <Activity className="w-4 h-4" />
      case 'domicile':
        return <Heart className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getCreatorBadge = (createdBy?: any) => {
    if (!createdBy) return null
    
    return createdBy.role === 'doctor' ? (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
        Programmé par médecin
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
        Demandé par patient
      </Badge>
    )
  }

  const getActionButtons = (appointment: any, variant: 'default' | 'compact' = 'default') => {
    const handleConfirm = async (appointmentId: string) => {
       try {
         const token = localStorage.getItem('auth_token')
         if (!token) {
           console.error('Token d\'authentification manquant')
           return
         }

         const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/accept`, {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json',
           }
         })

         if (response.ok) {
           const data = await response.json()
           if (data.success) {
             // Rafraîchir la liste des rendez-vous
             window.location.reload()
           } else {
             console.error('Erreur lors de la confirmation:', data.message)
           }
         } else {
           console.error('Erreur lors de la confirmation du rendez-vous')
         }
       } catch (error) {
         console.error('Erreur lors de la confirmation du rendez-vous:', error)
       }
     }

    const handleCancel = async (appointmentId: string) => {
       try {
         const token = localStorage.getItem('auth_token')
         if (!token) {
           console.error('Token d\'authentification manquant')
           return
         }

         const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/cancel`, {
           method: 'PATCH',
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ 
             cancellation_reason: 'Annulé par le patient' 
           })
         })

         if (response.ok) {
           const data = await response.json()
           if (data.success) {
             // Rafraîchir la liste des rendez-vous
             window.location.reload()
           } else {
             console.error('Erreur lors de l\'annulation:', data.message)
           }
         } else {
           console.error('Erreur lors de l\'annulation du rendez-vous')
         }
       } catch (error) {
         console.error('Erreur lors de l\'annulation du rendez-vous:', error)
       }
     }

    const handlePayment = (appointmentId: string) => {
      // Redirection vers la page de paiement
      router.push(`/dashboard/payment/${appointmentId}`)
    }

    // Si le RDV est confirmé par l'utilisateur, afficher "Régler" et "Annuler"
    if (appointment.status === 'confirmed') {
      if (variant === 'compact') {
        return (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePayment(appointment.id)}
              className="h-7 px-2 text-xs bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm border-emerald-200/60 dark:border-emerald-700/50 hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-green-100/80 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <CreditCard className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCancel(appointment.id)}
              className="h-7 px-2 text-xs bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 backdrop-blur-sm border-red-200/60 dark:border-red-700/50 hover:bg-gradient-to-r hover:from-red-100/80 hover:to-rose-100/80 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )
      }
      
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePayment(appointment.id)}
            className="h-8 px-3 bg-gradient-to-r from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm border-emerald-200/60 dark:border-emerald-700/50 hover:bg-gradient-to-r hover:from-emerald-100/80 hover:to-green-100/80 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-medium">Régler</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCancel(appointment.id)}
            className="h-8 px-3 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 backdrop-blur-sm border-red-200/60 dark:border-red-700/50 hover:bg-gradient-to-r hover:from-red-100/80 hover:to-rose-100/80 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-medium">Annuler</span>
          </Button>
        </div>
      )
    }
    
    // Si le RDV est programmé par le docteur, afficher "Confirmer" et "Annuler"
    if (appointment.status === 'scheduled' && appointment.created_by?.role === 'doctor') {
      if (variant === 'compact') {
        return (
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleConfirm(appointment.id)}
              className="h-7 px-2 text-xs bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border-blue-200/60 dark:border-blue-700/50 hover:bg-gradient-to-r hover:from-blue-100/80 hover:to-indigo-100/80 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCancel(appointment.id)}
              className="h-7 px-2 text-xs bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 backdrop-blur-sm border-red-200/60 dark:border-red-700/50 hover:bg-gradient-to-r hover:from-red-100/80 hover:to-rose-100/80 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )
      }
      
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleConfirm(appointment.id)}
            className="h-8 px-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border-blue-200/60 dark:border-blue-700/50 hover:bg-gradient-to-r hover:from-blue-100/80 hover:to-indigo-100/80 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-medium">Confirmer</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCancel(appointment.id)}
            className="h-8 px-3 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/20 backdrop-blur-sm border-red-200/60 dark:border-red-700/50 hover:bg-gradient-to-r hover:from-red-100/80 hover:to-rose-100/80 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-medium">Annuler</span>
          </Button>
        </div>
      )
    }
    
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600">Chargement des rendez-vous...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-200/50">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <AlertDescription className="text-red-700 font-medium">
          Erreur lors du chargement des rendez-vous. 
          <Button variant="link" onClick={refetch} className="p-0 h-auto ml-1 text-red-700 underline">
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header moderne avec glassmorphisme */}
      <div className="relative bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80 dark:from-blue-900/20 dark:via-gray-800/90 dark:to-indigo-900/20 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 p-4 lg:p-6">
        {/* Effet de brillance subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="space-y-1">
            <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 dark:from-blue-300 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">Mes Rendez-vous</h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs lg:text-sm font-medium">Gérez tous vos rendez-vous médicaux en un coup d'œil</p>
          </div>
          
          {/* Contrôles compacts */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
            <div className="relative group flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Rechercher médecin, spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 lg:py-2.5 w-full sm:w-64 lg:w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 text-xs"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 lg:px-4 py-2 lg:py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200 text-xs font-medium cursor-pointer min-w-[140px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="requested">Demandé</option>
              <option value="scheduled">Programmé</option>
              <option value="confirmed">Confirmé</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
              <option value="no_show">Absent</option>
            </select>
            
            {/* Toggle d'affichage */}
            <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-1 shadow-sm">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-3"
              >
                <Table className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des rendez-vous moderne */}
      <div>
        {filteredAppointments.length > 0 ? (
          <div>
            {viewMode === 'cards' && (
              <div className="grid gap-3">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="group relative bg-gradient-to-br from-white/90 via-white/95 to-blue-50/30 dark:from-gray-800/90 dark:via-gray-800/95 dark:to-blue-900/20 backdrop-blur-sm border border-blue-100/50 dark:border-blue-800/30 hover:border-blue-200/70 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 rounded-xl overflow-hidden">
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <CardContent className="relative p-3 lg:p-4">
                      <div className="flex items-center justify-between">
                        {/* Section principale compacte */}
                        <div className="flex items-center space-x-4 flex-1">
                          {/* Icône de type avec design moderne */}
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <div className="text-blue-600 dark:text-blue-400">
                              {getTypeIcon(appointment.appointment_type)}
                            </div>
                          </div>
                          
                          {/* Informations principales */}
                          <div className="flex-1 min-w-0">
                            {/* En-tête avec badges */}
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">
                                Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                              </h3>
                              {getStatusBadge(appointment.status)}
                              {getCreatorBadge(appointment.created_by)}
                            </div>
                            
                            {/* Grille d'informations compacte */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-300">
                              <div className="flex items-center space-x-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                                <DoctorSpecialization 
                                  specialization={appointment.doctor.specialization}
                                  className="text-xs font-medium"
                                  maxWidth="max-w-[120px]"
                                />
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="font-medium">{formatDate(appointment.appointment_date)}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span className="font-medium">{formatTime(appointment.appointment_date)}</span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                <span className="truncate font-medium">{appointment.appointment_type === 'presentiel' ? 'Cabinet médical' : appointment.appointment_type === 'visio' ? 'Visioconférence' : 'À domicile'}</span>
                              </div>
                            </div>
                            
                            {/* Motif compact */}
                            {appointment.reason_for_visit && (
                              <div className="mt-2 p-2 bg-gradient-to-r from-slate-50/80 to-blue-50/60 dark:from-slate-800/50 dark:to-blue-900/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                <p className="text-xs text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">Motif:</span> {appointment.reason_for_visit}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions compactes */}
                        <div className="flex items-center space-x-2 ml-4">
                          {getActionButtons(appointment)}
                          <Button variant="outline" size="sm" className="h-8 px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105">
                            <Edit className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs font-medium">Modifier</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 px-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-700/50 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs font-medium">Détails</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {doctorGroups.map((group, index) => {
                  const sortedAppointments = group.appointments.sort((a, b) => 
                    new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
                  )
                  const nextAppointment = sortedAppointments[0]
                  const appointmentCount = group.appointments.length
                  
                  return (
                    <Card key={`${group.doctor.id}-${index}`} className="group bg-gradient-to-br from-white/95 via-blue-50/30 to-indigo-50/20 dark:from-slate-800/95 dark:via-blue-900/20 dark:to-indigo-900/10 backdrop-blur-md border border-blue-200/40 dark:border-blue-700/30 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden">
                      {/* Header avec info docteur */}
                      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-blue-600/10 dark:from-blue-500/20 dark:via-indigo-500/10 dark:to-blue-500/20 p-4 border-b border-blue-200/30 dark:border-blue-700/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
                                Dr. {group.doctor.first_name} {group.doctor.last_name}
                              </h3>
                              {/* <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                                {group.doctor.specialization}
                              </p> */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-50 text-green-700 dark:text-green-300 border-green-300/50 text-xs font-semibold px-2 py-1">
                              {appointmentCount} RDV
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        {/* Prochain rendez-vous en évidence */}
                        <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/60 dark:from-emerald-900/20 dark:to-green-900/15 rounded-lg p-3 border border-emerald-200/50 dark:border-emerald-700/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                              Prochain RDV
                            </span>
                            {getStatusBadge(nextAppointment.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {formatDate(nextAppointment.appointment_date)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {formatTime(nextAppointment.appointment_date)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 col-span-2">
                              {getTypeIcon(nextAppointment.appointment_type)}
                              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize text-xs">
                                {nextAppointment.appointment_type}
                              </span>
                            </div>
                          </div>
                          
                          {nextAppointment.reason_for_visit && (
                            <div className="mt-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-700/30">
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Motif:</span> {nextAppointment.reason_for_visit}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Liste compacte des autres rendez-vous */}
                        {appointmentCount > 1 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Autres RDV ({appointmentCount - 1})
                              </span>
                            </div>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {sortedAppointments.slice(1, 4).map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-2 bg-slate-50/80 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <div className="w-6 h-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                                      {getTypeIcon(appointment.appointment_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                          {formatDate(appointment.appointment_date)}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          {formatTime(appointment.appointment_date)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {getStatusBadge(appointment.status)}
                                  </div>
                                </div>
                              ))}
                              {appointmentCount > 4 && (
                                <div className="text-center py-1">
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    +{appointmentCount - 4} autres rendez-vous
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                          {getCreatorBadge(nextAppointment.created_by)}
                          <div className="flex space-x-1">
                            {getActionButtons(nextAppointment, 'compact')}
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-gray-800 hover:text-blue-600 bg-white/80 hover:bg-blue-50 border-slate-300/50 transition-all duration-200 hover:scale-105">
                              <Edit className="w-3 h-3 mr-1" />
                              Gérer
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-gray-800 hover:text-blue-600 bg-white/80 hover:bg-blue-50 border-slate-300/50 transition-all duration-200 hover:scale-105">
                              <FileText className="w-3 h-3 mr-1" />
                              Voir tout
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
            
            {viewMode === 'table' && (
              <Card className="bg-gradient-to-br from-white/90 to-blue-50/30 dark:from-gray-800/90 dark:to-blue-900/20 backdrop-blur-sm border border-blue-100/50 dark:border-blue-800/30 shadow-lg">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/60 dark:from-slate-800/50 dark:to-blue-900/30 border-b border-slate-200/50 dark:border-slate-700/50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Médecin</th>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Date & Heure</th>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Statut</th>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Motif</th>
                          <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map((appointment, index) => (
                          <tr key={appointment.id} className={`border-b border-slate-200/30 dark:border-slate-700/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${index % 2 === 0 ? 'bg-white/20 dark:bg-slate-900/20' : ''}`}>
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg flex items-center justify-center">
                                  {getTypeIcon(appointment.appointment_type)}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800 dark:text-slate-100">
                                    Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
                                  </p>
                                  <DoctorSpecialization 
                                    specialization={appointment.doctor.specialization}
                                    className="text-sm text-slate-600 dark:text-slate-400"
                                    maxWidth="max-w-[150px]"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{formatDate(appointment.appointment_date)}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{formatTime(appointment.appointment_date)}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(appointment.appointment_type)}
                                <span className="text-sm font-medium capitalize">{appointment.appointment_type}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(appointment.status)}
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                                {appointment.reason_for_visit}
                              </p>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                {getActionButtons(appointment)}
                                <Button size="sm" variant="outline" className="h-8 transition-all duration-200 hover:scale-105">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 transition-all duration-200 hover:scale-105">
                                  <FileText className="w-3 h-3" />
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
            )}
          </div>
        ) : (
          <Alert className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300 font-medium">
              Aucun rendez-vous trouvé avec les critères de recherche actuels.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage