"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Map, 
  MapPin, 
  Navigation, 
  Maximize2, 
  Minimize2,
  Star,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Filter,
  List
} from "lucide-react"
import { Doctor } from "@/types/doctor"

interface DoctorMapViewProps {
  doctors: Doctor[]
  selectedDoctor?: Doctor | null
  onDoctorSelect?: (doctor: Doctor) => void
  onViewChange?: (view: 'map' | 'list') => void
  currentView?: 'map' | 'list'
  className?: string
}

interface MapMarker {
  id: string
  doctor: Doctor
  lat: number
  lng: number
  isSelected: boolean
}

// Coordonnées simulées pour les villes du Cameroun
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Yaoundé': { lat: 3.8480, lng: 11.5021 },
  'Douala': { lat: 4.0511, lng: 9.7679 },
  'Bamenda': { lat: 5.9631, lng: 10.1591 },
  'Bafoussam': { lat: 5.4781, lng: 10.4199 },
  'Garoua': { lat: 9.3265, lng: 13.3958 },
  'Maroua': { lat: 10.5913, lng: 14.3153 },
  'Ngaoundéré': { lat: 7.3167, lng: 13.5833 },
  'Bertoua': { lat: 4.5833, lng: 13.6833 },
  'Kribi': { lat: 2.9333, lng: 9.9167 },
  'Limbé': { lat: 4.0167, lng: 9.2167 }
}

export default function DoctorMapView({ 
  doctors, 
  selectedDoctor, 
  onDoctorSelect,
  onViewChange,
  currentView = 'map',
  className = ""
}: DoctorMapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 3.8480, lng: 11.5021 }) // Yaoundé par défaut
  const [zoom, setZoom] = useState(10)
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Générer les marqueurs à partir des médecins
  useEffect(() => {
    const newMarkers: MapMarker[] = doctors.map((doctor, index) => {
      const city = doctor.city || doctor.location?.split(',')[0] || 'Yaoundé'
      const baseCoords = cityCoordinates[city] || cityCoordinates['Yaoundé']
      
      // Ajouter une petite variation pour éviter la superposition
      const variation = 0.01
      const lat = baseCoords.lat + (Math.random() - 0.5) * variation
      const lng = baseCoords.lng + (Math.random() - 0.5) * variation

      return {
        id: doctor.id?.toString() || index.toString(),
        doctor,
        lat,
        lng,
        isSelected: selectedDoctor?.id === doctor.id
      }
    })

    setMarkers(newMarkers)
  }, [doctors, selectedDoctor])

  // Centrer la carte sur les médecins visibles
  useEffect(() => {
    if (markers.length > 0) {
      const lats = markers.map(m => m.lat)
      const lngs = markers.map(m => m.lng)
      
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
      
      setMapCenter({ lat: centerLat, lng: centerLng })
    }
  }, [markers])

  const handleMarkerClick = (marker: MapMarker) => {
    onDoctorSelect?.(marker.doctor)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setZoom(12)
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error)
        }
      )
    }
  }

  const getMarkerColor = (doctor: Doctor, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) return 'bg-emerald-600 border-emerald-700'
    if (isHovered) return 'bg-blue-500 border-blue-600'
    
    const rating = doctor.rating || 0
    if (rating >= 4.5) return 'bg-green-500 border-green-600'
    if (rating >= 4.0) return 'bg-yellow-500 border-yellow-600'
    if (rating >= 3.0) return 'bg-orange-500 border-orange-600'
    return 'bg-red-500 border-red-600'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Contrôles de la carte */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewChange?.('list')}
            className={`bg-white/90 backdrop-blur-sm shadow-sm ${
              currentView === 'list' ? 'bg-emerald-100 text-emerald-700' : ''
            }`}
          >
            <List className="w-4 h-4 mr-1" />
            Liste
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewChange?.('map')}
            className={`bg-white/90 backdrop-blur-sm shadow-sm ${
              currentView === 'map' ? 'bg-emerald-100 text-emerald-700' : ''
            }`}
          >
            <Map className="w-4 h-4 mr-1" />
            Carte
          </Button>
        </div>
        
        <div className="flex flex-col gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMyLocation}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-emerald-50"
          >
            <Navigation className="w-4 h-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-emerald-50"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Légende */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Légende
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div>
              <span>Excellent (4.5+)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600"></div>
              <span>Très bien (4.0+)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600"></div>
              <span>Bien (3.0+)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div>
              <span>Moyen (&lt;3.0)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-700"></div>
              <span>Sélectionné</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte simulée */}
      <div 
        ref={mapRef}
        className={`relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-96'
        }`}
      >
        {/* Grille de fond pour simuler une carte */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Marqueurs des médecins */}
        {markers.map((marker) => {
          const isHovered = hoveredMarker === marker.id
          const markerColor = getMarkerColor(marker.doctor, marker.isSelected, isHovered)
          
          // Position simulée sur la carte (pourcentage)
          const x = ((marker.lng - (mapCenter.lng - 0.1)) / 0.2) * 100
          const y = ((mapCenter.lat + 0.1 - marker.lat) / 0.2) * 100

          return (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
              style={{ 
                left: `${Math.max(5, Math.min(95, x))}%`, 
                top: `${Math.max(5, Math.min(95, y))}%` 
              }}
              onClick={() => handleMarkerClick(marker)}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Marqueur */}
              <div className={`w-6 h-6 rounded-full border-2 ${markerColor} shadow-lg flex items-center justify-center`}>
                <MapPin className="w-3 h-3 text-white" />
              </div>

              {/* Tooltip au survol */}
              {isHovered && (
                <Card className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 shadow-lg z-20 bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={marker.doctor.avatar} />
                        <AvatarFallback>
                          {marker.doctor.name?.charAt(0) || 
                           `${marker.doctor.first_name?.charAt(0)}${marker.doctor.last_name?.charAt(0)}`}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {marker.doctor.name || `${marker.doctor.first_name} ${marker.doctor.last_name}`}
                        </h4>
                        <p className="text-xs text-slate-600 truncate">
                          {marker.doctor.specialty}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{marker.doctor.rating?.toFixed(1) || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span>{marker.doctor.consultation_fee || 'N/A'} FCFA</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 truncate">
                            {marker.doctor.location || marker.doctor.city}
                          </span>
                        </div>

                        {marker.doctor.next_available && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs text-emerald-600">
                              Disponible {marker.doctor.next_available}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}

        {/* Message si aucun médecin */}
        {markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-500 dark:text-slate-400">
              <Map className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Aucun médecin à afficher</p>
              <p className="text-xs mt-1">Ajustez vos filtres de recherche</p>
            </div>
          </div>
        )}

        {/* Contrôles de zoom */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setZoom(Math.min(18, zoom + 1))}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm shadow-sm"
          >
            +
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setZoom(Math.max(8, zoom - 1))}
            className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm shadow-sm"
          >
            -
          </Button>
        </div>

        {/* Informations de zoom */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-slate-600">
          Zoom: {zoom}
        </div>
      </div>

      {/* Carte sélectionnée (détails) */}
      {selectedDoctor && (
        <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-80 shadow-lg z-20 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedDoctor.avatar} />
                <AvatarFallback>
                  {selectedDoctor.name?.charAt(0) || 
                   `${selectedDoctor.first_name?.charAt(0)}${selectedDoctor.last_name?.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">
                  {selectedDoctor.name || `${selectedDoctor.first_name} ${selectedDoctor.last_name}`}
                </h3>
                <p className="text-sm text-slate-600">{selectedDoctor.specialty}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{selectedDoctor.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-xs text-slate-500">
                      ({selectedDoctor.reviews_count || 0} avis)
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {selectedDoctor.consultation_fee || 'N/A'} FCFA
                  </Badge>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1 h-8 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Rendez-vous
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}