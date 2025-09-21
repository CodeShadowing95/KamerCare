"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  CalendarPlus,
  Video
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import FanGauge from "./FanGauge"
import { DoctorSpecialization } from "@/components/ui/doctor-specialization"

interface NavbarProps {
  onMenuClick?: () => void
  className?: string
}

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "Nouveau rendez-vous",
    message: "Marie Ngono a pris un rendez-vous pour demain à 14h",
    time: "Il y a 5 min",
    unread: true
  },
  {
    id: 2,
    type: "message",
    title: "Message patient",
    message: "Jean Mballa a envoyé un message concernant ses résultats",
    time: "Il y a 15 min",
    unread: true
  },
  {
    id: 3,
    type: "reminder",
    title: "Rappel consultation",
    message: "Consultation avec Fatima Alhadji dans 30 minutes",
    time: "Il y a 1h",
    unread: false
  }
]

const quickActions = [
  {
    id: "new-appointment",
    label: "Nouveau RDV",
    icon: CalendarPlus,
    color: "bg-blue-500",
    href: "/doctor/appointments/new"
  },
  {
    id: "quick-visio",
    label: "Consultation rapide",
    icon: Video,
    color: "bg-green-500",
    href: "/doctor/rdv-rapide"
  },
  // {
  //   id: "emergency",
  //   label: "Urgence",
  //   icon: Clock,
  //   color: "bg-red-500",
  //   href: "/doctor/emergency"
  // }
]

export function DoctorNavbar({ onMenuClick, className }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuth()
  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return Calendar
      case "message":
        return MessageSquare
      case "reminder":
        return Clock
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "text-blue-600"
      case "message":
        return "text-green-600"
      case "reminder":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher patients, rendez-vous..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-colors"
          />
        </div>

        {/* Quick Actions */}
        <div className="hidden lg:flex items-center space-x-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => {
                  if (action.href) {
                    window.location.href = action.href
                  }
                }}
              >
                <div className={cn("w-2 h-2 rounded-full", action.color)} />
                <Icon className="h-3 w-3" />
                <span className="text-xs">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Current Time */}
        {/* <div className="hidden md:flex flex-col items-end text-sm">
          <span className="text-gray-900 font-medium">
            {new Date().toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <span className="text-gray-500 text-xs">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div> */}

        {/* Section centrale - FanGauge */}
        <div className="flex-1 flex justify-center max-w-xs">
          <FanGauge currentFans={0} targetFans={18000} />
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} nouvelles
                </Badge>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                      notification.unread && "bg-blue-50"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        notification.unread ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          notification.unread ? getNotificationColor(notification.type) : "text-gray-500"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium",
                          notification.unread ? "text-gray-900" : "text-gray-700"
                        )}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-3 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:text-blue-700">
                Voir toutes les notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Settings */}
        {/* <Button variant="ghost" size="sm" className="p-2">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="doctor.png" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                  {(user?.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) || 'DR').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="doctor.png" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {user?.name?.charAt(0) || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-900">
                    Dr. {user?.name || 'Docteur'}
                  </p>
                  <div className="flex items-center gap-1">
                    <DoctorSpecialization 
                      specialization={user?.doctor?.specialization || user?.speciality}
                      className="text-xs text-gray-500"
                      maxWidth="max-w-[120px]"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {user?.email || 'docteur@kamercare.com'}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Mon profil</span>
                <span className="text-xs text-gray-500">Gérer mes informations</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Planning</span>
                <span className="text-xs text-gray-500">Voir mes rendez-vous</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <Settings className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Paramètres</span>
                <span className="text-xs text-gray-500">Préférences et sécurité</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                <HelpCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Aide & Support</span>
                <span className="text-xs text-gray-500">Centre d'aide et contact</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 focus:text-red-600 transition-colors"
              onClick={logout}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Déconnexion</span>
                <span className="text-xs text-red-400">Se déconnecter du compte</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}