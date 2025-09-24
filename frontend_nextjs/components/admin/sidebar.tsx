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
    <div className="fixed inset-y-0 left-0 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      {/* Header avec avatar admin */}
      <div className="relative p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative">
          {/* Avatar et informations admin */}
          <div
            className="flex items-center space-x-4 cursor-pointer group transition-all duration-200 hover:bg-white/10 rounded-xl p-3 -m-3"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-white/30 shadow-lg">
                {/* <AvatarImage src="/admin.png" alt={user?.name || 'Admin'} /> */}
                <AvatarFallback className="bg-gradient-to-br from-orange-500/50 to-rose-500/40 text-white font-semibold text-lg">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">
                {user?.name || 'Kepta Ezechiel'}
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30 text-xs px-2 py-0.5">
                  Admin
                </Badge>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* Menu contextuel */}
          {showUserMenu && (
            <div
              ref={menuRef}
              className="absolute top-full left-3 right-3 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
            >
              <div className="py-2">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                >
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profil</span>
                </button>
                <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Déconnexion</span>
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