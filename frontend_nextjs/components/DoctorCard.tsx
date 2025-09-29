import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Star, Clock, User, Calendar, DollarSign, Briefcase, AlertCircle, Award, Heart, ArrowDown, ChevronDown, EllipsisVertical, CalendarClock, CalendarDays, ShieldCheck, Info, Flag } from 'lucide-react';
import { Doctor } from '@/hooks/use-doctors';
import { useAuth } from '@/hooks/use-auth';
import { useDoctorLikes } from '@/hooks/use-doctor-likes';
import { useRouter } from 'next/navigation';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected?: boolean;
  onSelect?: () => void;
  onReserve?: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected = false, onSelect, onReserve }) => {
  const { user, token } = useAuth();
  const { toggleLike, getLikeData, isLoading } = useDoctorLikes();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [showSpecialtiestooltip, setShowSpecialtiestooltip] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [likeData, setLikeData] = useState({ is_liked: false, likes_count: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Charger les données de like au montage du composant
  useEffect(() => {
    if (doctor.id) {
      getLikeData(doctor.id, token || undefined).then(data => {
        setLikeData(data);
      });
    }
  }, [user, token, doctor.id, getLikeData]);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Gérer le toggle du like
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !token) {
      setShowLoginOverlay(true);
      setTimeout(() => {
        setShowLoginOverlay(false);
      }, 5000);
      return;
    }

    try {
      const success = await toggleLike(doctor.id, token, likeData.is_liked);
      if (success) {
        // Mettre à jour l'état local
        setLikeData(prev => ({
          is_liked: !prev.is_liked,
          likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
        }));
      }
    } catch (error) {
      console.error('Erreur lors du toggle du like:', error);
    }
  };

  // Gérer le clic sur le bouton ellipsis
  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Gérer le signalement du docteur
  const handleReportDoctor = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    // TODO: Implémenter la logique de signalement
    console.log('Signaler le docteur:', doctor.id);
  };

  // Adapter les propriétés du doctor pour correspondre à l'interface attendue
  const specialties = (() => {
    let specs = [];
    if (doctor.specialization) {
      if (typeof doctor.specialization === 'string') {
        specs = doctor.specialization.split(',').map(s => s.trim());
      } else {
        specs = doctor.specialization;
      }
    } else if (doctor.specialty) {
      if (typeof doctor.specialty === 'string') {
        specs = doctor.specialty.split(',').map(s => s.trim());
      } else {
        specs = doctor.specialty;
      }
    } else {
      specs = ['Médecine Générale'];
    }
    return specs.filter(s => s && s.length > 0);
  })();
  
  const experienceYears = doctor.years_of_experience;
  
  const consultationPrice = doctor.consultation_fee || doctor.consultationFee || 0;
  const formatConsultationHours = () => {
    if (!doctor.consultation_hours) return "Horaires non disponibles";
    if (typeof doctor.consultation_hours === 'string') return doctor.consultation_hours;
    if (typeof doctor.consultation_hours === 'object') {
      const availableDays = Object.entries(doctor.consultation_hours).slice(0,2)
        .filter(([dateKey, dayData]: [string, any]) => {
          // Filtrer seulement les jours disponibles avec des créneaux
          return dayData && typeof dayData === 'object' && 
                 dayData.available && 
                 dayData.slots && 
                 Array.isArray(dayData.slots) && 
                 dayData.slots.length > 0 &&
                 dayData.slots.some((slot: any) => slot.time && slot.time.trim() !== '');
        })
        .map(([dateKey, dayData]: [string, any]) => {
          // Convertir la date YYYY-MM-DD en format "28 Sept"
          const date = new Date(dateKey);
          const displayName = date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short'
          });
          
          // Compter les créneaux disponibles
          const availableSlots = dayData.slots
            .filter((slot: any) => slot.time && slot.time.trim() !== '')
            .length;
          
          return `${displayName} (${availableSlots} créneaux)`;
        })
        .filter(dayInfo => dayInfo);
      
      return availableDays.length > 0 ? availableDays.join(', ') : "Aucun créneau disponible";
    }
    return "Horaires non disponibles";
  };

  const getConsultationData = () => {
    if (!doctor.consultation_hours) return null;
    if (typeof doctor.consultation_hours === 'string') return null;
    if (typeof doctor.consultation_hours === 'object') {
      return Object.entries(doctor.consultation_hours)
        .filter(([dateKey, dayData]: [string, any]) => {
          // Filtrer seulement les jours disponibles avec des créneaux
          return dayData && typeof dayData === 'object' && 
                 dayData.available && 
                 dayData.slots && 
                 Array.isArray(dayData.slots) && 
                 dayData.slots.length > 0 &&
                 dayData.slots.some((slot: any) => slot.time && slot.time.trim() !== '');
        })
        .map(([dateKey, dayData]: [string, any]) => {
          // Convertir la date YYYY-MM-DD en format "28 Septembre 2025"
          const date = new Date(dateKey);
          const displayName = date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          
          // Récupérer tous les créneaux avec des heures valides
          const allSlots = dayData.slots
            .filter((slot: any) => slot.time && slot.time.trim() !== '')
            .map((slot: any) => ({ time: slot.time, status: slot.status }));
          
          return { 
            day: displayName, 
            slots: allSlots,
            date: dateKey,
            slotsCount: allSlots.length
          };
        })
        .filter(dayInfo => dayInfo.slots && dayInfo.slots.length > 0);
    }
    return null;
  };

  // Variables d'affichage
  const displaySpecialties = specialties; // Garder comme tableau pour le mapping
  const displayExperience = `${experienceYears} ans d'expérience`;
  const displayPrice = `${Math.floor(consultationPrice).toLocaleString()}`;

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Effacer l'erreur précédente
    setAuthError(null);
    
    // Vérifier si l'utilisateur est connecté
    if (!user || !token) {
      setShowLoginOverlay(true);
      setTimeout(() => {
        setShowLoginOverlay(false);
      }, 5000)
      return;
    }
    
    // Si connecté, procéder à la réservation
    onReserve?.(doctor);
  };
  
  return (
    <div 
      className={`group relative bg-gradient-to-br from-teal-50/80 via-white to-blue-50/60 backdrop-blur-sm border border-white/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
        isSelected ? 'ring-2 ring-emerald-400 shadow-emerald-100' : ''
      }`}
      onClick={onSelect}
    >
      {/* Shield overlay bg */}
      <ShieldCheck className="absolute -bottom-12 -right-12 w-56 h-56 text-slate-400/10" />

      {/* Overlay gradient pour l'effet de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Contenu principal avec layout horizontal */}
      <div className="relative flex h-52">
        {/* Section gauche - Photo du docteur */}
        <div className="w-32 flex-shrink-0 relative overflow-hidden">
          {/* Photo de profil */}
          <div className="absolute inset-0">
            <img
              src="/doctor.png"
              alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "/doctor.png"
              }}
            />
            {/* Overlay gradient sur la photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          
          {/* Badge de statut en ligne */}
          <div className="absolute top-1 left-1">
            <div className="flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>En ligne</span>
            </div>
          </div>
          
          {/* Actions rapides sur la photo */}
          {user && token && (
            <div className="absolute bottom-3 left-3 flex space-x-2 transition-opacity duration-300">
              <button 
                onClick={handleLikeToggle}
                disabled={isLoading}
                className={`p-1.5 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 ${
                  likeData.is_liked 
                    ? 'bg-red-500/90 hover:bg-red-600/90' 
                    : 'bg-white/90 hover:bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`w-3 h-3 ${
                  likeData.is_liked ? 'text-white fill-current' : 'text-red-500'
                }`} />
              </button>
            </div>
          ) }
        </div>
        
        {/* Section droite - Informations du docteur */}
        <div className="flex-1 px-4 py-2 flex flex-col gap-2 justify-between">
          {/* Header avec nom et actions */}
          <div className="space-y-4">
            {/* Nom et spécialité */}
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-teal-700 text-base leading-tight group-hover:text-emerald-700 transition-colors duration-300">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors duration-200"
                    onClick={handleEllipsisClick}
                  >
                    <EllipsisVertical className="w-3 h-3 text-slate-500 hover:text-slate-700" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={handleReportDoctor}
                        className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors duration-150"
                      >
                        <Flag className="w-4 h-4 text-red-500" />
                        <span>Signaler le docteur</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {displaySpecialties.length > 0 && (
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-slate-800">
                      {displaySpecialties[0]}
                    </p>
                    {displaySpecialties.length > 1 && (
                      <div 
                        className="relative"
                        onMouseEnter={() => setShowSpecialtiestooltip(true)}
                        onMouseLeave={() => setShowSpecialtiestooltip(false)}
                      >
                        <Info className="w-3 h-3 text-slate-500 hover:text-slate-700 cursor-help" />
                        
                        {/* Tooltip */}
                        {showSpecialtiestooltip && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                            <div className="bg-slate-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg max-w-xs">
                              <div className="font-medium mb-1 whitespace-nowrap">Autres spécialités :</div>
                              <div className="space-y-0.5">
                                {displaySpecialties.slice(1).map((specialty, index) => (
                                  <div key={index} className="text-slate-200 whitespace-nowrap">
                                    • {specialty}
                                  </div>
                                ))}
                              </div>
                              {/* Flèche du tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-800"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-0.5">
              {/* Note et Likes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-slate-500 text-xs">4.8</span>
                  <span className="text-slate-500 text-xs leading-[14px]">(127 avis)</span>
                </div>
                {likeData.likes_count > 0 && (
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-red-500 fill-current" />
                    <span className="text-slate-500 text-xs">{likeData.likes_count}</span>
                  </div>
                )}
              </div>

              {/* Localisation */}
              <div className="flex items-center text-slate-500 text-xs">
                <MapPin className="w-3 h-3 mr-1.5 text-slate-600" />
                {/* <span className="truncate text-xs leading-[14px]">{doctor.city}</span> */}
                <span className="truncate text-xs leading-[14px]">RHP8+66G, Yaoundé</span>
              </div>

              {/* Expérience */}
              <div className="flex items-center space-x-1 text-slate-500">
                <Briefcase className="w-3 h-3 mr-1.5 text-slate-600" />
                <span className="truncate text-xs leading-[14px]">{displayExperience}</span>
              </div>
            </div>

            {/* Heures de consultation */}
            <div className="flex items-center space-x-1 text-slate-500 text-[11px] leading-[14px]">
              <CalendarClock className="w-3 h-3 mr-1.5 text-slate-600 flex-shrink-0" />
              {formatConsultationHours()}
            </div>
          </div>
          
          {/* Footer avec prix et bouton */}
          <div className="space-x-3 mt-auto flex items-end">
            {/* Prix */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <p className="text-xl font-bold text-blue-400 tracking-tighter">
                  {displayPrice}
                </p>
                <div className='-space-y-2'>
                  <p className="text-[10px] text-slate-500">FCFA/</p>
                  <p className="text-[10px] text-slate-500">consultation</p>
                </div>
              </div>
            </div>
            
            {/* Bouton de réservation */}
            <button
              onClick={handleReserveClick}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold p-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] text-xs"
            >
              Réserver
            </button>
          </div>
        </div>
      </div>
      
      {/* Indicateur de sélection */}
      {/* {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg animate-pulse" />
        </div>
      )} */}

      {/* Overlay de connexion */}
      {showLoginOverlay && (
        <div className={"absolute inset-0 bg-red-500/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 animate-in fade-in duration-300"} onClick={e => e.stopPropagation()}>
          <div className="p-6 max-w-sm mx-4 text-center">
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-white mb-2">
                Connexion requise
              </h3>
              <p className="text-sm text-gray-200">
                Vous devez vous connecter pour pouvoir prendre un rendez-vous avec ce médecin.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  const currentUrl = window.location.pathname + window.location.search
                  window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default DoctorCard;