"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, MapPin, Star, Calendar, Clock, Heart, User, Phone, Mail, ChevronDown, Settings, LogOut, FileText, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDoctors, useAppointments, type Doctor } from "@/hooks/use-doctors"
import { useCreateAppointment } from "@/hooks/use-create-appointment"
import { useAuth } from "@/hooks/use-auth"
import DoctorCard from "@/components/DoctorCard"
import { MapWrapper } from "@/components/MapComponent"



interface AppointmentModalProps {
  doctor: Doctor
  isOpen: boolean
  onClose: () => void
}

function AppointmentModal({ doctor, isOpen, onClose }: AppointmentModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [consultationType, setConsultationType] = useState<'presentiel' | 'visio' | 'domicile'>('presentiel')
  const [reason, setReason] = useState<string>('')
  const { createAppointment, loading: bookingLoading, error } = useCreateAppointment()
  const { user, isAuthenticated } = useAuth()

  const handleSubmit = async () => {
    if (!selectedSlot || !reason.trim()) return

    if (!isAuthenticated || !user) {
      alert('Vous devez être connecté pour prendre un rendez-vous')
      return
    }

    if (user.role !== 'patient') {
      alert('Seuls les patients peuvent prendre des rendez-vous')
      return
    }

    try {
      const appointmentData = {
        doctor_id: doctor.id, // ID du profil docteur
        appointment_date: selectedSlot,
        appointment_type: consultationType,
        reason_for_visit: reason.trim(),
        consultation_fee: doctor.consultation_fee || 0
      }

      const result = await createAppointment(appointmentData)

      if (result.success) {
        alert(`Demande de rendez-vous envoyée avec succès pour le ${selectedSlot} avec Dr. ${doctor.name}`)
        onClose()
        // Reset form
        setSelectedSlot('')
        setConsultationType('presentiel')
        setReason('')
      }
    } catch (error) {
      alert('Erreur lors de la prise de rendez-vous. Veuillez réessayer.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">
            Heures de consultation du {doctor.name}
          </DialogTitle>
        </DialogHeader>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Sélection des créneaux par jour */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
              Sélectionnez une horaire pour demander un rendez-vous
            </h4>

            <div className="space-y-4">
              {doctor.consultation_hours && typeof doctor.consultation_hours === 'object' ? (() => {
                const [currentDayIndex, setCurrentDayIndex] = useState(0);

                const availableDays = Object.entries(doctor.consultation_hours)
                  .filter(([dateKey, schedule]: [string, any]) => {
                    return schedule && schedule.available && schedule.slots &&
                      Array.isArray(schedule.slots) && schedule.slots.length > 0 &&
                      schedule.slots.some((slot: any) => slot.time && slot.time.trim() !== '' && slot.status === 'pending');
                  })
                  .sort(([dateA], [dateB]) => {
                    return new Date(dateA).getTime() - new Date(dateB).getTime();
                  })
                  .map(([dateKey, schedule]: [string, any]) => {
                    const date = new Date(dateKey);
                    const displayName = date.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });

                    const availableSlots = schedule.slots
                      .filter((slot: any) => slot.time && slot.time.trim() !== '' && slot.status === 'pending');

                    return {
                      day: displayName,
                      dateKey: dateKey,
                      slots: availableSlots
                    };
                  });

                if (availableDays.length === 0) {
                  return (
                    <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/70 backdrop-blur-sm border border-blue-200/40 rounded-xl p-6 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm text-gray-500">Aucun créneau disponible pour le moment</div>
                    </div>
                  );
                }

                const currentDay = availableDays[currentDayIndex] || availableDays[0];

                const goToPreviousDay = () => {
                  setCurrentDayIndex(prev => prev > 0 ? prev - 1 : availableDays.length - 1);
                };

                const goToNextDay = () => {
                  setCurrentDayIndex(prev => prev < availableDays.length - 1 ? prev + 1 : 0);
                };

                return (
                  <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/70 backdrop-blur-sm border border-blue-200/40 rounded-xl p-4 shadow-sm">
                    {/* En-tête avec navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={goToPreviousDay}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-white/50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-800">
                          {currentDay.day}
                        </div>
                        <div className="text-xs text-gray-600">
                          {currentDay.slots.length} créneau(x) disponible(s)
                        </div>
                      </div>
                      <button
                        onClick={goToNextDay}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-white/50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Grille des créneaux horaires du jour sélectionné */}
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {currentDay.slots.map((slot: any) => {
                        const slotValue = `${currentDay.dateKey} ${slot.time}`;
                        const isPending = slot.status === 'pending';
                        
                        // Vérifier si le créneau est dans le passé
                        const isToday = currentDay.dateKey === new Date().toISOString().split('T')[0];
                        const currentTime = new Date();
                        const [hours, minutes] = slot.time.split(':').map(Number);
                        const slotTime = new Date();
                        slotTime.setHours(hours, minutes, 0, 0);
                        const isPastSlot = isToday && currentTime > slotTime;
                        
                        const isDisabled = !isPending || isPastSlot;
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => !isDisabled && setSelectedSlot(slotValue)}
                            disabled={isDisabled}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isPastSlot
                                ? 'bg-gray-100/80 text-gray-400 border border-gray-200/60 cursor-not-allowed opacity-60'
                                : !isPending
                                ? 'bg-gray-200/60 text-gray-400 border border-gray-300/40 cursor-not-allowed'
                                : selectedSlot === slotValue
                                  ? 'bg-emerald-500 text-white shadow-md scale-105'
                                  : 'bg-white/80 text-gray-700 border border-white/60 hover:bg-white/95 hover:shadow-sm hover:scale-105'
                              }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <Clock className={`w-3 h-3 ${isPastSlot ? 'text-gray-300' : ''}`} />
                              <span>{slot.time}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })() : (
                <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/70 backdrop-blur-sm border border-blue-200/40 rounded-xl p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-sm text-gray-500">Aucun créneau disponible pour le moment</div>
                </div>
              )}
            </div>
          </div>

          {/* Sélection du type de consultation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              Type de consultation *
            </label>
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value as 'presentiel' | 'visio' | 'domicile')}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-800 dark:text-slate-100 text-sm"
            >
              <option value="presentiel">Consultation en présentiel</option>
              <option value="visio">Téléconsultation</option>
              <option value="domicile">Consultation à domicile</option>
            </select>
          </div>

          {/* Textarea pour la raison du RDV */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
              <User className="w-4 h-4 mr-2 text-emerald-600" />
              Raison(s) de la demande de rendez-vous *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Décrivez brièvement la raison pour laquelle vous demandez un rendez-vous (symptômes, problème de santé, bilan de santé, consultation de routine, etc.)"
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-800 dark:text-slate-100 text-sm"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
              {reason.length}/500 caractères
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={bookingLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedSlot || !consultationType || !reason.trim() || bookingLoading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              {bookingLoading ? 'Envoi en cours...' : 'Confirmer la demande'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Composant wrapper pour gérer la modal de rendez-vous
function DoctorCardWithModal({ doctor, isSelected, onSelect }: { doctor: Doctor, isSelected?: boolean, onSelect?: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReserve = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <DoctorCard 
        doctor={doctor} 
        isSelected={isSelected}
        onSelect={onSelect}
        onReserve={handleReserve} 
      />
      <AppointmentModal
        doctor={doctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      window.location.href = '/'
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-300 font-medium"
        onClick={() => {
          const currentUrl = window.location.href;
          window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
        }}
      >
        Se connecter
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-900/20 dark:hover:to-blue-900/20 transition-all duration-300 rounded-xl p-2"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg ring-2 ring-white dark:ring-slate-800 transition-transform duration-300 hover:scale-105">
              <img
                src="/user.jpg"
                alt="User avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
              {user?.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              En ligne
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl">
        <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs leading-none text-slate-600 dark:text-slate-400 truncate">{user?.email}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">En ligne</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-lg p-3 group"
          onClick={() => window.location.href = '/dashboard'}
        >
          <FileText className="mr-3 h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">Mes RDV</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Gérer vos rendez-vous</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-3 group">
          <User className="mr-3 h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">Profil</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Informations personnelles</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-3 group">
          <Settings className="mr-3 h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">Paramètres</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Préférences et sécurité</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 transition-all duration-200 rounded-lg p-3 group"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>
            <span className="text-xs text-red-500/70">Se déconnecter du compte</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function SearchDoctorsPage() {
  const searchParams = useSearchParams()
  const city = searchParams.get('city') || ''
  const specialty = searchParams.get('specialty') || ''
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const { doctors, loading, error, searchDoctors } = useDoctors()

  useEffect(() => {
    // Effectuer la recherche avec les paramètres de l'URL
    searchDoctors({
      city: city || undefined,
      specialty: specialty || undefined
    })
  }, [city, specialty, searchDoctors])

  // Fonction de recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors)
    } else {
      const filtered = doctors.filter(doctor => 
        doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredDoctors(filtered)
    }
  }, [searchQuery, doctors])

  // Mettre à jour filteredDoctors quand doctors change
  useEffect(() => {
    setFilteredDoctors(doctors)
  }, [doctors])

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Recherche des médecins...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Erreur de recherche</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-700/30 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-emerald-50 dark:hover:bg-emerald-900/30 h-8 px-3 text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Retour
                </Button>
              </Link>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">Médecins disponibles</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {city && `${city}`} {city && specialty && ' • '} {specialty && `${specialty}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs px-2 py-1">
                {filteredDoctors.length} médecin{filteredDoctors.length > 1 ? 's' : ''}
              </Badge> */}
              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-8">
        {filteredDoctors.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
            {/* Colonne gauche - Liste des cartes docteur */}
            <div className="w-full md:w-1/2 overflow-y-auto pr-3 pl-2">
              <div className="flex flex-col gap-4">
                {/* Barre de recherche */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Rechercher par nom, spécialité, ville..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 pl-4 py-2 w-full h-10 text-xs border-slate-200 dark:border-slate-700 focus:border-emerald-300 dark:focus:border-emerald-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-800 w-4 h-4" />
                </div>
                <div className="flex max-[420px]:flex-col flex-row items-center justify-between gap-2 mb-4">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800">{filteredDoctors.length}</span> médecin{filteredDoctors.length > 1 ? 's' : ''} trouvés
                  </span>
                  <Select defaultValue="price">
                    <SelectTrigger className="w-[180px] h-8 text-xs border border-slate-300">
                      <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Trier par prix</SelectItem>
                      <SelectItem value="rating">Trier par note</SelectItem>
                      <SelectItem value="distance">Trier par distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Liste des docteurs - 2 par ligne */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredDoctors.map((doctor) => (
                  <DoctorCardWithModal 
                    key={doctor.id}
                    doctor={doctor} 
                    isSelected={selectedDoctor?.id === doctor.id}
                    onSelect={() => handleDoctorSelect(doctor)}
                  />
                ))}
              </div>
            </div>

            {/* Colonne droite - Carte interactive */}
            <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="relative h-full">
                <MapWrapper
                  doctors={doctors}
                  onDoctorSelect={handleDoctorSelect}
                  className="h-full w-full"
                />
                {/* Contrôles de la carte */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="bg-white dark:bg-slate-800 p-2 rounded-md shadow-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="bg-white dark:bg-slate-800 p-2 rounded-md shadow-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
                {/* Indicateur de sélection */}
                {selectedDoctor && (
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 px-3 py-2 rounded-md shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedDoctor.city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Aucun médecin trouvé
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700">
                Nouvelle recherche
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}