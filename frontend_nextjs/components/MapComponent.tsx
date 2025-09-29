"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Doctor } from '@/hooks/use-doctors'
import { DollarSign, MapPin, User } from 'lucide-react'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapComponentProps {
  doctors: Doctor[]
  onDoctorSelect?: (doctor: Doctor) => void
  className?: string
}

// Coordonnées par défaut pour Yaoundé, Cameroun
const DEFAULT_CENTER: [number, number] = [3.848, 11.5021]
const DEFAULT_ZOOM = 12

// Fonction pour obtenir des coordonnées approximatives basées sur la ville
const getCityCoordinates = (city: string): [number, number] => {
  const cityCoords: { [key: string]: [number, number] } = {
    'yaoundé': [3.848, 11.5021],
    'douala': [4.0511, 9.7679],
    'bamenda': [5.9631, 10.1591],
    'bafoussam': [5.4781, 10.4199],
    'garoua': [9.3265, 13.3978],
    'maroua': [10.5906, 14.3137],
    'ngaoundéré': [7.3167, 13.5833],
    'bertoua': [4.5833, 13.6833],
    'ebolowa': [2.9167, 11.15],
    'kribi': [2.9333, 9.9167]
  }
  
  const normalizedCity = city.toLowerCase().trim()
  return cityCoords[normalizedCity] || DEFAULT_CENTER
}

// Fonction pour ajouter une petite variation aléatoire aux coordonnées
const addRandomOffset = (coords: [number, number]): [number, number] => {
  const offset = 0.01 // ~1km de variation
  return [
    coords[0] + (Math.random() - 0.5) * offset,
    coords[1] + (Math.random() - 0.5) * offset
  ]
}

export default function MapComponent({ doctors, onDoctorSelect, className = '' }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false)
  const [doctorsWithCoords, setDoctorsWithCoords] = useState<(Doctor & { coords: [number, number] })[]>([])

  useEffect(() => {
    setIsClient(true)
    
    // Ajouter des coordonnées aux docteurs
    const doctorsWithCoordinates = doctors.map(doctor => ({
      ...doctor,
      coords: addRandomOffset(getCityCoordinates(doctor.city || 'yaoundé'))
    }))
    
    setDoctorsWithCoords(doctorsWithCoordinates)
  }, [doctors])

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full rounded-lg z-0"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {doctorsWithCoords.map((doctor) => {
          // Import dynamique de l'icône Leaflet
          const L = require('leaflet')
          
          // Créer une icône personnalisée pour les docteurs
          const doctorIcon = new L.Icon({
            iconUrl: '/doctor.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
          })

          return (
            <Marker
              key={doctor.id}
              position={doctor.coords}
              icon={doctorIcon}
              eventHandlers={{
                click: () => onDoctorSelect?.(doctor)
              }}
            >
              <Popup>
                <div className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden min-w-[280px] max-w-[320px]">
                  {/* En-tête avec dégradé */}
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-base leading-tight mb-1">{doctor.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <span className="text-xs font-medium">{doctor.specialty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <svg className="w-3 h-3 text-yellow-300 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-xs font-semibold">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="px-4 py-3 space-y-1">
                    {/* Localisation */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      </div>
                      <span className="text-xs font-medium">{doctor.office_address === "" ? doctor.office_address : "Adresse non fournie"} {doctor.city}</span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-3 h-3 text-emerald-600 shrink-0" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">Montant consultation</span>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg px-3 py-1">
                        <span className="text-xs font-extrabold text-emerald-700">
                          {Math.floor(doctor.consultationFee || 0).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <button
                      onClick={() => onDoctorSelect?.(doctor)}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <User className='w-4 h-4 shrink-0' />
                      <span className="text-sm">Voir le profil</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

// Composant wrapper pour gérer le CSS de Leaflet
export function MapWrapper({ children, ...props }: MapComponentProps & { children?: React.ReactNode }) {
  useEffect(() => {
    // Import Leaflet CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [])

  return <MapComponent {...props}>{children}</MapComponent>
}