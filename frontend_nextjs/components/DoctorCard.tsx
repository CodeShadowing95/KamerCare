import React, { useState } from 'react';
import { MapPin, Star, Clock, User, Calendar, DollarSign, Briefcase, AlertCircle, Award, Heart, ArrowDown, ChevronDown } from 'lucide-react';
import { Doctor } from '@/hooks/use-doctors';
import { useAuth } from '@/hooks/use-auth';
import { DoctorSpecialization } from '@/components/ui/doctor-specialization';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected?: boolean;
  onSelect?: () => void;
  onReserve?: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected = false, onSelect, onReserve }) => {
  const { user, token } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

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
  
  const experienceYears = typeof doctor.years_of_experience === 'string' 
    ? parseInt(doctor.years_of_experience) || doctor.experience || 0
    : doctor.experience || 0;
  
  const consultationPrice = doctor.consultation_fee || doctor.consultationFee || 0;
  const formatConsultationHours = () => {
    if (!doctor.consultation_hours) return null;
    if (typeof doctor.consultation_hours === 'string') return doctor.consultation_hours;
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
  
  const weeklyHours = formatConsultationHours();
  const doctorPhoto = doctor.photo || '/placeholder.jpg';

  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Effacer l'erreur précédente
    setAuthError(null);
    
    // Vérifier si l'utilisateur est connecté
    if (!user || !token) {
      setAuthError('Vous devez vous connecter pour pouvoir réserver un rendez-vous.');
      // Effacer le message après 5 secondes
      setTimeout(() => setAuthError(null), 5000);
      return;
    }
    
    // Si connecté, procéder à la réservation
    onReserve?.(doctor);
  };
  
  return (
    <div 
      className={`group relative bg-gradient-to-br from-white to-gray-50/30 rounded-lg border transition-all duration-300 cursor-pointer p-2 sm:p-3 backdrop-blur-sm ${
        isSelected 
          ? 'border-blue-400 shadow-lg shadow-blue-100/50 ring-1 ring-blue-100 scale-[1.01]' 
          : 'border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg hover:shadow-blue-50/30 hover:scale-[1.005]'
      }`}
      onClick={onSelect}
    >
      {/* Gradient overlay pour l'effet premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-teal-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Header avec avatar et info principale */}
      <div className="relative flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="relative">
          <img 
            src={doctorPhoto} 
            alt={doctor.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-md group-hover:ring-blue-100 transition-all duration-300"
          />
          {/* Badge de statut en ligne */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight truncate group-hover:text-blue-700 transition-colors duration-200">
                {doctor.name}
              </h3>
              {doctor.is_certified === 'Yes' && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Award className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium hidden sm:inline">Certifié</span>
                  <span className="text-xs text-blue-600 font-medium sm:hidden">✓</span>
                </div>
              )}
            </div>
            <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 hover:fill-current cursor-pointer transition-all duration-200" />
          </div>

          {/* Localisation */}
          <div className="mt-0.5 sm:mt-1">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0 text-blue-500" />
              <span className="text-xs font-medium truncate">{doctor.city || 'Non spécifié'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spécialités */}
      <div className="mb-2 sm:mb-3">
        <DoctorSpecialization 
          specialization={specialties.join(', ')}
          className="text-xs"
          maxWidth="max-w-[200px] sm:max-w-[250px]"
        />
      </div>

      {/* Note et Expérience */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center cursor-pointer group/rating hover:bg-yellow-50 px-1 sm:px-1.5 py-0.5 rounded-md transition-all duration-200">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-700 ml-1 sm:ml-1.5 font-medium group-hover/rating:text-yellow-700">
              {doctor.rating}
            </span>
          </div>
        </div>
        <div className="flex items-center bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
          <Briefcase className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5 sm:mr-1 flex-shrink-0 text-blue-600" />
          <span className="text-xs text-blue-700 font-medium">{doctor.years_of_experience || "0"}<span className="hidden sm:inline"> ans</span></span>
        </div>
      </div>

      {/* Prix et bouton réserver */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 pt-2 sm:pt-2.5 border-t border-gray-100">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              {consultationPrice.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-gray-600">FCFA</span>
          </div>
          <span className="text-xs text-gray-500 font-medium hidden sm:block">/consultation</span>
        </div>
        <button 
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg hover:shadow-blue-200/50 transform hover:scale-105 active:scale-95 overflow-hidden group/btn"
          onClick={handleReserveClick}
        >
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Réserver</span>
        </button>
      </div>
      
      {/* Message d'erreur d'authentification - Overlay absolu */}
      {authError && (
        <div className="absolute inset-0 bg-red-500/90 rounded-lg flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300 z-10">
          <AlertCircle className="w-8 h-8 text-white" />
          <p className="text-sm text-white font-medium text-center px-4 leading-relaxed">{authError}</p>
          <button 
            className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              const currentUrl = window.location.href;
              window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;
            }}
          >
            Se connecter
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;