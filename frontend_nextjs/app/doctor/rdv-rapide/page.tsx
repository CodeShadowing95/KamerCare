"use client"

import { PatientSelector } from "@/components/doctor/dashboard-doctor/visio/patient-selector"
import { VideoCallInterface } from "@/components/doctor/dashboard-doctor/visio/video-call-interface"
import { useState } from "react"
import { Video, Users, Clock, Stethoscope, CheckCircle, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingAnimation } from "@/components/ui/loading-animation"

export default function RdvRapidePage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callReason, setCallReason] = useState("")

  const handleStartCall = (patient: any) => {
    if (patient && callReason.trim()) {
      setIsCallActive(true)
    }
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setCallReason("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 animate-fade-in">
      {/* Header avec stats rapides */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 animate-slide-down">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex justify-between items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">Consultation Rapide</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {/* <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full transition-smooth hover-lift">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">En ligne</span>
              </div> */}
              <div className="flex items-center space-x-1 text-green-700 px-3 py-1 bg-green-100 rounded-full transition-smooth hover-lift">
                <Clock className="h-3 w-3" />
                <span className="text-xs font-medium">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar - Sélection des patients */}
          <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200 flex flex-col animate-slide-up">
            <PatientSelector
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onStartCall={(patient) => handleStartCall(patient)}
              callReason={callReason}
              onCallReasonChange={setCallReason}
            />
          </div>

          {/* Zone principale */}
          <div className="flex-1 flex flex-col animate-scale-in">
            {isCallActive ? (
              <div className="h-[calc(100vh-80px)] transition-smooth">
                <VideoCallInterface
                  patient={selectedPatient}
                  onEndCall={handleEndCall}
                  callReason={callReason}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md mx-auto">
                  <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-glow opacity-20"></div>
                      <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-float transition-bounce hover-lift">
                        <LoadingAnimation variant="pulse" size="lg" className="text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-slide-up">
                    Prêt pour la consultation
                  </h2>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in">
                    {selectedPatient 
                      ? `Sélectionnez une raison de consultation${callReason ? ' et cliquez sur "Démarrer l\'appel"' : ''} pour commencer la visioconférence avec ${selectedPatient.name}.`
                      : "Sélectionnez un patient dans la liste pour commencer une consultation vidéo instantanée."
                    }
                  </p>

                  {/* Indicateurs visuels */}
                  <div className="flex justify-center space-x-4 mb-8">
                    <div className="flex flex-col items-center space-y-2 card-interactive p-4 rounded-lg bg-gray-50 hover-lift">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 font-medium">Caméra</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 card-interactive p-4 rounded-lg bg-gray-50 hover-lift">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 font-medium">Audio</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 card-interactive p-4 rounded-lg bg-gray-50 hover-lift">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 font-medium">Réseau</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Connexion sécurisée et chiffrée</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span>Conforme aux normes RGPD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
