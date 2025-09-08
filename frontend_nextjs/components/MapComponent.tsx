"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Doctor } from '@/hooks/use-doctors'

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
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1">{doctor.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500 mb-1">{doctor.city}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-500">★ {doctor.rating}</span>
                    <span className="font-medium">{doctor.consultationFee?.toLocaleString()} FCFA</span>
                  </div>
                  <button
                    onClick={() => onDoctorSelect?.(doctor)}
                    className="w-full mt-2 bg-emerald-500 text-white text-xs py-1 px-2 rounded hover:bg-emerald-600 transition-colors"
                  >
                    Voir le profil
                  </button>
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