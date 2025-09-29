"use client"

import { useState, useRef, useEffect } from "react"
import {
  BarChart3,
  Users,
  Building2,
  Shield,
  FileText,
  Activity,
  DollarSign,
  Database,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const SidebarAdmin = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(typeof window !== 'undefined') {
      const activeItem = localStorage.getItem("activeTab")
      if(activeItem) {
        setActiveTab(activeItem)
      }
    }
  }, [])

  const sidebarItems = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble',
      icon: BarChart3,
      selectedTabClassName: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-sm dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:border-blue-700/30",
      onClick: () => {
        setActiveTab("overview")
        localStorage.setItem("activeTab", "overview")
        router.push('/admin')
      },
      enabled: true,
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      icon: Users,
      selectedTabClassName: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200/50 shadow-sm dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300 dark:border-purple-700/30",
      onClick: () => {
        setActiveTab("users")
        localStorage.setItem("activeTab", "users")
        router.push('/admin/manage-users')
      },
      enabled: true,
    },
    {
      id: 'hospitals',
      title: 'Hôpitaux',
      icon: Building2,
      selectedTabClassName: "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 shadow-sm dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300 dark:border-indigo-700/30",
      onClick: () => {
        setActiveTab("hospitals")
        localStorage.setItem("activeTab", "hospitals")
        router.push('/admin/manage-hospitals')
      },
      enabled: true,
    },
    {
      id: 'specialties',
      title: 'Spécialités',
      icon: Activity,
      selectedTabClassName: "bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200/50 shadow-sm dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-300 dark:border-teal-700/30",
      onClick: () => {
        setActiveTab("specialties")
        localStorage.setItem("activeTab", "specialties")
        router.push('/admin/manage-specialties')
      },
      enabled: false,
    },
    {
      id: 'payments',
      title: 'Paiements',
      icon: DollarSign,
      selectedTabClassName: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 shadow-sm dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 dark:border-amber-700/30",
      onClick: () => {
        setActiveTab("payments")
        localStorage.setItem("activeTab", "payments")
        router.push('/admin/manage-payments')
      },
      enabled: false,
    },
    {
      id: 'content',
      title: 'Contenus',
      icon: FileText,
      selectedTabClassName: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200/50 shadow-sm dark:from-rose-900/30 dark:to-pink-900/30 dark:text-rose-300 dark:border-rose-700/30",
      onClick: () => {
        setActiveTab("content")
        localStorage.setItem("activeTab", "content")
        router.push('/admin/manage-content')
      },
      enabled: false,
    },
    {
      id: 'logs',
      title: 'Journaux d\'activités',
      icon: Database,
      selectedTabClassName: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200/50 shadow-sm dark:from-rose-900/30 dark:to-pink-900/30 dark:text-rose-300 dark:border-rose-700/30",
      onClick: () => {
        setActiveTab("logs")
        localStorage.setItem("activeTab", "logs")
        router.push('/admin/manage-logs')
      },
      enabled: false,
    },
    {
      id: 'reports',
      title: 'Rapports',
      icon: FileText,
      selectedTabClassName: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200/50 shadow-sm dark:from-rose-900/30 dark:to-pink-900/30 dark:text-rose-300 dark:border-rose-700/30",
      onClick: () => {
        setActiveTab("reports")
        localStorage.setItem("activeTab", "reports")
        router.push('/admin/manage-reports')
      },
      enabled: false,
    },
    
  ]

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleProfile = () => {
    setShowUserMenu(false)
    // Navigation vers le profil admin
    router.push("/admin/profile")
  }

  return (
    <div className="fixed inset-y-0 left-0 w-72 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-r border-slate-200/40 dark:border-slate-700/40 shadow-2xl">
      {/* Header élégant et compact */}
      <div className="relative p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="relative">
          {/* Avatar et informations admin - Design compact */}
          <div
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-lg p-2 -m-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10 ring-2 ring-slate-200/60 dark:ring-slate-700/60 shadow-md transition-all duration-300 group-hover:ring-blue-300/60 dark:group-hover:ring-blue-600/60">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm">
                {user?.name || 'Kepta Ezechiel'}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Administrateur</span>
              </div>
            </div>
            <div className="flex items-center">
              <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-all duration-300 ${showUserMenu ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            </div>
          </div>

          {/* Menu contextuel élégant */}
          {showUserMenu && (
            <div
              ref={menuRef}
              className="absolute top-full left-2 right-2 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300"
            >
              <div className="py-1.5">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mon Profil</span>
                </button>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mx-3 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors duration-200">
                    <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="px-3 pt-4 space-y-1">
        {sidebarItems.map((item: any) => {
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              disabled={!item.enabled}
              className={`w-full justify-between h-10 px-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${activeTab === item.id ? item.selectedTabClassName : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"}`}
              onClick={item.onClick}
            >
              <div className="flex items-center">
                <item.icon className="w-4 h-4 mr-2.5" />
                {item.title}
              </div>
              {!item.enabled && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600"
                >
                  Bientôt
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

export default SidebarAdmin