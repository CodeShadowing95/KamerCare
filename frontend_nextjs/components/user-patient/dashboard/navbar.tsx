"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Heart, Plus, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'

const Navbar = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState<string>('overview')
  const [isScrolled, setIsScrolled] = useState(false)

  // Synchroniser avec localStorage au montage du composant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('activeView') || 'overview'
      setActiveView(savedView)
    }
  }, [])

  // Gérer l'effet de scroll pour le background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const redirect = (path: string) => {
    setActiveView(path)
    localStorage.setItem("activeView", path)
    switch (path) {
      case 'overview':
        router.push('/dashboard')
        break;
      case 'mes-rdv':
        router.push('/dashboard/mes-rdv')
        break;
      case 'history':
        router.push('/dashboard/historique')
        break;
      case 'profile':
        router.push('/dashboard/profile')
        break;
      case 'settings':
        router.push('/dashboard/settings')
        break;
      default:
        router.push(path)
        break;
    }
  }

  return (
    <header className={`sticky top-0 z-50 py-0.5 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo et titre */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-end space-x-2.5 group">
              <div className="relative">
                <img
                  src="/KamerCare-logo.png"
                  alt="KamerCare Logo"
                  className="w-12 h-12 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
                <div className="hidden w-12 h-12 bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-600 rounded-xl items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-base font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  KamerCare
                </div>
                <div className="text-[9px] leading-tight text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                  Votre santé, notre priorité
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation compacte */}
          <nav className="hidden md:flex space-x-4 px-2 py-1 rounded-md bg-gradient-to-r from-white/95 via-blue-50/80 to-indigo-50/70 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-900/85 backdrop-blur-md border-b border-blue-200/40 dark:border-gray-700/50 shadow-sm">
            <button
              onClick={() => redirect('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeView === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => redirect('mes-rdv')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeView === 'mes-rdv'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}
            >
              Mes Rendez-vous
            </button>
            <button
              onClick={() => redirect('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeView === 'history'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}
            >
              Historique
            </button>
          </nav>

          {/* Actions élégantes */}
          <div className="flex items-center space-x-3">
            {/* Bouton de notification avec design amélioré */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative w-8 h-8 p-0 rounded-xl bg-gradient-to-br from-slate-50/80 to-blue-50/60 dark:from-gray-800/80 dark:to-gray-700/60 backdrop-blur-sm border border-blue-100/50 dark:border-gray-600/50 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/5 rounded-xl transition-all duration-300"></div>
                <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 relative z-10 group-hover:scale-110" />
                {/* Badge de notification amélioré */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                  <div className="absolute inset-0.5 bg-white/20 rounded-full animate-ping"></div>
                </div>
              </Button>
            </div>

            {/* Bouton Nouveau RDV avec design premium */}
            <Button className="relative overflow-hidden bg-blue-50/80 backdrop-blur-md border border-blue-200/50 dark:bg-blue-900/20 dark:border-blue-700/50 hover:border-blue-300/70 dark:hover:border-blue-600/70 text-blue-700 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-300/30 hover:shadow-lg hover:shadow-blue-200/30 dark:hover:shadow-blue-900/20 transition-all duration-200 text-xs px-3 py-1.5 h-8 rounded-lg font-medium group">
              {/* Effet glassmorphisme au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/0 via-pink-200/0 to-blue-200/0 group-hover:from-blue-200/20 group-hover:via-pink-200/15 group-hover:to-blue-200/20 dark:group-hover:from-blue-800/20 dark:group-hover:via-pink-800/15 dark:group-hover:to-blue-800/20 transition-all duration-200 rounded-lg"></div>
              
              {/* Contenu compact */}
              <div className="relative flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-2 h-2 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="group-hover:scale-105 transition-transform duration-200">Nouveau RDV</span>
              </div>
              
              {/* Reflet glassmorphisme */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent group-hover:from-white/20 transition-all duration-200 rounded-lg"></div>
            </Button>

            {/* Dropdown Menu Profil compact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 px-1.5 rounded-lg bg-gradient-to-br from-slate-50/80 to-blue-50/60 dark:from-gray-800/80 dark:to-gray-700/60 backdrop-blur-sm border border-blue-100/50 dark:border-gray-600/50 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="relative">
                      <Avatar className="w-6 h-6 ring-1 ring-white/50 dark:ring-gray-800/50 group-hover:ring-blue-300/70 dark:group-hover:ring-blue-500/50 transition-all duration-200">
                        <AvatarImage src="" alt={user?.name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white text-xs font-bold">
                          {user?.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Indicateur de statut minimal */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-gray-800"></div>
                    </div>
                    
                    <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:rotate-180" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-44 mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-100/50 dark:border-gray-700/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 rounded-lg p-1"
              >
                {/* En-tête compact */}
                <div className="px-2 py-1.5 border-b border-blue-100/50 dark:border-gray-700/50 mb-1">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'email@exemple.com'}</p>
                </div>
                
                {/* Options compactes */}
                <DropdownMenuItem 
                  onClick={() => redirect('profile')}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-150 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Profil</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => redirect('settings')}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-all duration-150 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">Paramètres</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="my-1 bg-blue-100/50 dark:bg-gray-700/50" />
                
                <DropdownMenuItem 
                  onClick={() => {
                    logout()
                  }}
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-150 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar