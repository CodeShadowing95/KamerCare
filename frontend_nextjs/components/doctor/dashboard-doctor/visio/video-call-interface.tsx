"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquareText, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react"

interface VideoCallInterfaceProps {
  patient: any
  onEndCall: () => void
  callReason: string
}

export function VideoCallInterface({ patient, onEndCall, callReason }: VideoCallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("excellent")
  const [callDuration, setCallDuration] = useState(0)

  // Simulate call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate connection quality changes
  useEffect(() => {
    const qualityTimer = setInterval(() => {
      const qualities: ("excellent" | "good" | "poor")[] = ["excellent", "good", "poor"]
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)])
    }, 10000)

    return () => clearInterval(qualityTimer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-accent"
      case "good":
        return "text-yellow-500"
      case "poor":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getConnectionBars = (quality: string) => {
    switch (quality) {
      case "excellent":
        return [true, true, true, true]
      case "good":
        return [true, true, true, false]
      case "poor":
        return [true, true, false, false]
      default:
        return [true, false, false, false]
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      {/* Call Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {patient.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">{patient.name}</h2>
              <p className="text-xs text-muted-foreground">Motif: {callReason}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Connection Quality */}
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-1">
                {getConnectionBars(connectionQuality).map((active, index) => (
                  <div
                    key={index}
                    className={`w-1 bg-current ${
                      active ? getConnectionColor(connectionQuality) : "text-muted-foreground/30"
                    }`}
                    style={{ height: `${(index + 1) * 4 + 4}px` }}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${getConnectionColor(connectionQuality)}`}>
                {connectionQuality === "excellent" ? "Excellente" : connectionQuality === "good" ? "Bonne" : "Faible"}
              </span>
            </div>

            {/* Call Duration */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-foreground">{formatDuration(callDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-slate-900">
        {/* Main Video Feed */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            {isVideoOff ? (
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                    {patient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white text-lg">{patient.name}</p>
                <p className="text-slate-300 text-sm">Caméra désactivée</p>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg">{patient.name}</p>
                  <p className="text-slate-300 text-sm">En attente de connexion...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Doctor's Video Preview */}
        <Card className="absolute top-4 right-4 w-48 h-36 overflow-hidden">
          <CardContent className="p-0 h-full">
            {isVideoOff ? (
              <div className="h-full bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarImage src="/caring-doctor.png" alt="Dr. Martin" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">DM</AvatarFallback>
                  </Avatar>
                  <p className="text-white text-xs">Vous</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs">Vous</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screen Sharing Indicator */}
        {isScreenSharing && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-accent text-accent-foreground">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Partage d'écran actif
            </Badge>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-card border-t border-border px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="lg"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Video Button */}
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="lg"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
          </Button>

          {/* Screen Share Button */}
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <MessageSquareText className="w-5 h-5" />
          </Button>

          {/* End Call Button */}
          <Button variant="destructive" size="lg" className="h-12 px-6 rounded-full" onClick={onEndCall}>
            <PhoneOff className="w-5 h-5 mr-2" />
            Raccrocher
          </Button>
        </div>
      </div>
    </div>
  )
}
