"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Calendar,
  Users,
  Clock,
  MessageSquare,
  Settings,
  Activity,
  FileText,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  activeItem: string
  onItemClick: (item: string) => void
  unreadMessages?: number
}

const menuItems = [
  {
    id: "overview",
    label: "Vue d'ensemble",
    icon: Activity,
    badge: null,
    href: "/doctor"
  },
  {
    id: "appointments",
    label: "Rendez-vous",
    icon: Calendar,
    badge: null,
    href: "/doctor/appointments"
  },
  {
    id: "patients",
    label: "Patients",
    icon: Users,
    badge: null,
    href: "/doctor/patients"
  },
  {
    id: "queue",
    label: "File d'attente",
    icon: Clock,
    badge: null,
    href: "/doctor/queue"
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    badge: null,
    href: "/doctor/messages"
  },
  {
    id: "prescriptions",
    label: "Ordonnances",
    icon: FileText,
    badge: null,
    href: "/doctor/ordonnances"
  },
  {
    id: "analytics",
    label: "Statistiques",
    icon: TrendingUp,
    badge: null,
    href: "/doctor/statistiques"
  }
]

const settingsItems = [
  {
    id: "profile",
    label: "Profil",
    icon: User,
    href: "/doctor/profile"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/doctor/notifications"
  },
  {
    id: "security",
    label: "Sécurité",
    icon: Shield,
    href: "/doctor/security"
  },
  {
    id: "billing",
    label: "Facturation",
    icon: CreditCard,
    href: "/doctor/billing"
  },
  {
    id: "help",
    label: "Aide",
    icon: HelpCircle,
    href: "/doctor/help"
  }
]

export function DoctorSidebar({ 
  collapsed = false, 
  onToggle, 
  activeItem, 
  onItemClick, 
  unreadMessages = 0 
}: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/doctor/login")
  }

  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    }
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col h-screen z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img src="/KamerCare-logo.png" alt="KamerCare" className="h-8 shrink-0" />
              <span className="font-semibold text-gray-900">KamerCare</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="p-1.5 hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Doctor Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10 relative">
              <AvatarImage src="doctor.png" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {(user?.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) || 'DR').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute top-0 right-0 bg-green-500 rounded-full w-3 h-3"></div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Dr. {user?.name?.split(' ').slice(0,2).join(' ') || 'Docteur'}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 truncate">
                  {(() => {
                    const specialities = user?.doctor?.specialization || user?.speciality;
                    if (Array.isArray(specialities) && specialities.length > 0) {
                      return specialities[0];
                    }
                    return specialities || 'Médecin généraliste';
                  })()}
                </span>
                {(() => {
                  const specialities = user?.doctor?.specialization || user?.speciality;
                  if (Array.isArray(specialities) && specialities.length > 1) {
                    const additionalSpecialities = specialities.slice(1);
                    return (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 min-w-0 cursor-help">
                              +{specialities.length - 1}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p className="font-medium mb-1 text-xs">Autres spécialités :</p>
                              <ul className="space-y-0.5">
                                {(Array.isArray(additionalSpecialities) ? additionalSpecialities : [additionalSpecialities]).map((speciality, index) => (
                                  <li key={index}>• {speciality}</li>
                                ))}
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }
                  return null;
                })()}
              </div>
              {/* <Badge variant="secondary" className="mt-1 text-xs">
                En ligne
              </Badge> */}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            // Utiliser unreadMessages pour l'item messages
            const badgeValue = item.id === "messages" && unreadMessages > 0 ? unreadMessages.toString() : item.badge
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id)
                  router.push(item.href)
                }}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.label}</span>
                    {badgeValue && (
                      <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className="ml-auto text-xs"
                      >
                        {badgeValue}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Settings Section */}
        {!collapsed && (
          <div className="mt-8 px-2">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Paramètres
              </h3>
            </div>
            <nav className="space-y-1">
              {settingsItems.map((item) => {
                const Icon = item.icon
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onItemClick(item.id)
                      router.push(item.href)
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      activeItem === item.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="flex-shrink-0 h-4 w-4 text-gray-400" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </div>
  )
}