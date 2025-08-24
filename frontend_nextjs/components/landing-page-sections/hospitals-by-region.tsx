'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Star, Clock, Users, Heart, Navigation } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Styles personnalisés pour les popups Leaflet
const customPopupStyles = `
  .custom-popup .leaflet-popup-content-wrapper {
    background: transparent;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: none;
    padding: 0;
    overflow: hidden;
  }
  .custom-popup .leaflet-popup-content {
    margin: 0;
    padding: 0;
    border-radius: 12px;
    overflow: hidden;
  }
  .custom-popup .leaflet-popup-tip {
    background: white;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .custom-popup .leaflet-popup-close-button {
    display: none;
  }
`

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface Hospital {
  id: number
  name: string
  city: string
  region: string
  services: string[]
  rating: number
  coordinates?: { lat: number; lng: number }
  phone?: string
  address?: string
}

interface HospitalsByRegionProps {
  hospitals: Hospital[]
  language?: 'fr' | 'en'
}

const texts = {
  fr: {
    title: 'Hôpitaux par région',
    subtitle: 'Trouvez l\'hôpital le plus proche de chez vous',
    moreHospitals: 'Plus d\'hôpitaux',
    viewAvailability: 'Voir disponibilités',
    call: 'Appeler',
    directions: 'Itinéraire',
    mapTitle: 'Localisation des hôpitaux',
    noHospitals: 'Aucun hôpital trouvé dans cette région'
  },
  en: {
    title: 'Hospitals by region',
    subtitle: 'Find the nearest hospital to you',
    moreHospitals: 'More hospitals',
    viewAvailability: 'View availability',
    call: 'Call',
    directions: 'Directions',
    mapTitle: 'Hospital locations',
    noHospitals: 'No hospitals found in this region'
  }
}

export default function HospitalsByRegion({ hospitals, language = 'fr' }: HospitalsByRegionProps) {
  const [showAll, setShowAll] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [isClient, setIsClient] = useState(false)
  const t = texts[language]
  
  const displayedHospitals = showAll ? hospitals : hospitals.slice(0, 10)
  const hasMoreHospitals = hospitals.length > 10

  useEffect(() => {
    setIsClient(true)
    // Fix for default markers in Leaflet
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
      
      // Injecter les styles personnalisés
      const styleElement = document.createElement('style')
      styleElement.textContent = customPopupStyles
      document.head.appendChild(styleElement)
      
      return () => {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <section id="hospitals" className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des hôpitaux - Gauche */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Hôpitaux disponibles ({hospitals.length})
              </h3>
            </div>
            
            {displayedHospitals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">{t.noHospitals}</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-800">
                {displayedHospitals.map((hospital, index) => (
                  <div 
                    key={hospital.id} 
                    className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                      selectedHospital?.id === hospital.id 
                        ? 'ring-2 ring-emerald-500 shadow-emerald-100 dark:shadow-emerald-900/50 scale-[1.02]' 
                        : 'hover:scale-[1.01] hover:shadow-lg'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={() => setSelectedHospital(hospital)}
                  >
                    {/* Gradient border effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      selectedHospital?.id === hospital.id ? 'opacity-100' : ''
                    }`} style={{padding: '2px'}}>
                      <div className="bg-white dark:bg-slate-800 rounded-2xl h-full w-full" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative p-6">
                      {/* Header with hospital info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">{hospital.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {hospital.name}
                              </h3>
                              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                                <span className="font-medium">{hospital.city}</span>
                                <span className="mx-1">•</span>
                                <span>{hospital.region}</span>
                              </div>
                            </div>
                          </div>
                          
                          {hospital.address && (
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-3 pl-15">
                              <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                                {hospital.address}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Rating badge */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-current mr-1" />
                            <span className="font-bold text-sm">{hospital.rating}</span>
                          </div>
                          {hospital.phone && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                              <Phone className="w-3 h-3 inline mr-1" />
                              Disponible
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Services */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {hospital.services.slice(0, 4).map((service, serviceIndex) => (
                            <span 
                              key={service} 
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                serviceIndex === 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                serviceIndex === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                serviceIndex === 2 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                              }`}
                            >
                              {service}
                            </span>
                          ))}
                          {hospital.services.length > 4 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              +{hospital.services.length - 4} autres
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {t.viewAvailability}
                        </Button>
                        
                        <div className="flex gap-2">
                          {hospital.phone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="px-3 border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20 transition-all duration-300"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="px-3 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300"
                          >
                            <Navigation className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    {selectedHospital?.id === hospital.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {hasMoreHospitals && !showAll && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAll(true)}
                  className="bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  {t.moreHospitals} ({hospitals.length - 10})
                </Button>
              </div>
            )}
          </div>

          {/* Carte interactive - Droite */}
          <div className="lg:sticky lg:top-4">
            <Card className="h-[700px] overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                  {t.mapTitle}
                </CardTitle>
                {selectedHospital && (
                  <CardDescription className="text-emerald-600 dark:text-emerald-400">
                    {selectedHospital.name} sélectionné
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  {isClient ? (
                    <MapContainer
                      center={[3.848, 11.502]} // Center of Cameroon
                      zoom={6}
                      style={{ height: '100%', width: '100%' }}
                      className="rounded-lg"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {hospitals.map((hospital, index) => (
                        hospital.coordinates && (
                          <Marker
                            key={index}
                            position={[hospital.coordinates.lat, hospital.coordinates.lng]}
                            eventHandlers={{
                              click: () => setSelectedHospital(hospital),
                            }}
                          >
                            <Popup
                                className="custom-popup"
                                maxWidth={260}
                                minWidth={240}
                              >
                               <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
                                 {/* Header avec gradient */}
                                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 text-white">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-bold text-base mb-0.5 leading-tight">
                                          {hospital.name}
                                        </h4>
                                        <p className="text-emerald-100 text-xs flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {hospital.city}, {hospital.region}
                                        </p>
                                      </div>
                                      <div className="bg-white/20 rounded-full p-1.5 ml-2">
                                        <Heart className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                  </div>

                                 {/* Contenu principal */}
                                  <div className="p-3 space-y-2">
                                   {/* Rating et stats */}
                                   <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                       <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                         <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                         <span className="text-sm font-semibold text-yellow-700">{hospital.rating}</span>
                                       </div>
                                       <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                         <Users className="h-3 w-3 text-blue-500" />
                                         <span className="text-xs text-blue-700">24/7</span>
                                       </div>
                                     </div>
                                   </div>

                                   {/* Contact */}
                                    {hospital.phone && (
                                      <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded">
                                        <Phone className="h-3 w-3 text-emerald-600" />
                                        <span className="text-xs text-slate-700 font-medium">{hospital.phone}</span>
                                      </div>
                                    )}
 
                                    {/* Adresse */}
                                    {hospital.address && (
                                      <div className="flex items-start gap-2 p-1.5 bg-slate-50 rounded">
                                        <MapPin className="h-3 w-3 text-emerald-600 mt-0.5" />
                                        <span className="text-xs text-slate-700">{hospital.address}</span>
                                      </div>
                                    )}

                                   {/* Services */}
                                    {hospital.services && hospital.services.length > 0 && (
                                      <div>
                                        <h5 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                          <Heart className="h-3 w-3 text-emerald-600" />
                                          Services
                                        </h5>
                                        <div className="flex flex-wrap gap-1">
                                          {hospital.services.slice(0, 2).map((service, idx) => (
                                            <Badge 
                                              key={idx} 
                                              variant="secondary" 
                                              className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-1.5 py-0.5"
                                            >
                                              {service}
                                            </Badge>
                                          ))}
                                          {hospital.services.length > 2 && (
                                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                              +{hospital.services.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}
 
                                    {/* Bouton d'action */}
                                    <div className="pt-1.5 border-t border-slate-100">
                                      <Button 
                                        size="sm" 
                                        className="w-full h-7 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium text-xs"
                                        onClick={() => setSelectedHospital(hospital)}
                                      >
                                        <Clock className="h-3 w-3 mr-1" />
                                        Voir disponibilités
                                      </Button>
                                    </div>
                                 </div>
                               </div>
                             </Popup>
                          </Marker>
                        )
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="h-full bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto">
                          <MapPin className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Chargement de la carte...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}