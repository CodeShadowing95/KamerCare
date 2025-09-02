'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import {
  Heart,
  Globe,
  Moon,
  Sun,
  User,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import NotificationsDropdown from './notifications-dropdown'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  isDark?: boolean
  language?: string
  onToggleTheme?: () => void
  onToggleLanguage?: () => void
}

export default function Navbar({
  isDark = false,
  language = 'fr',
  onToggleTheme,
  onToggleLanguage,
}: NavbarProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const texts = {
    fr: {
      services: 'Services & Spécialités',
      hospitals: 'Hôpitaux par région',
      login: 'Se connecter',
      doctorSpace: 'Espace Médecin',
      takeAppointment: 'Prendre RDV',
      myAppointments: 'Mes RDV',
      profile: 'Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
    en: {
      services: 'Services & Specialties',
      hospitals: 'Hospitals by region',
      login: 'Sign in',
      doctorSpace: 'Doctor Space',
      takeAppointment: 'Book Appointment',
      myAppointments: 'My Appointments',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
  }

  const t = texts[language as keyof typeof texts]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      console.log('User logged out successfully')
      router.push('/')
    } catch (error) {
      // Enhanced error logging for better debugging
      console.error('Erreur lors de la déconnexion:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        error: error,
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        stringified: JSON.stringify(error, null, 2)
      })
      
      // Still redirect to home even if logout API fails
      router.push('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-teal-900/20 dark:hover:to-blue-900/20 transition-all duration-300 rounded-xl p-2"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg ring-2 ring-white dark:ring-slate-800 transition-transform duration-300 hover:scale-105">
              <img 
                src="/user.jpg" 
                alt="User avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
              {user?.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              En ligne
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl">
        <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-xs leading-none text-slate-600 dark:text-slate-400 truncate">{user?.email}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">En ligne</span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem className="cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 rounded-lg p-3 group">
          <Calendar className="mr-3 h-5 w-5 text-teal-600 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{t.takeAppointment}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Réserver un nouveau RDV</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-lg p-3 group"
          onClick={() => router.push('/dashboard')}
        >
          <FileText className="mr-3 h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{t.myAppointments}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Gérer vos rendez-vous</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-3 group">
          <User className="mr-3 h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{t.profile}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Informations personnelles</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-3 group">
          <Settings className="mr-3 h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{t.settings}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Préférences et sécurité</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:text-red-600 transition-all duration-200 rounded-lg p-3 group"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col">
            <span className="font-medium">{isLoggingOut ? 'Déconnexion...' : t.logout}</span>
            <span className="text-xs text-red-500/70">Se déconnecter du compte</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/KamerCare-logo.png" 
                alt="KamerCare Logo" 
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }}
              />
              {/* <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div> */}
            </div>
            <div className="hidden md:block">
              <div className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                KamerCare
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Votre santé, notre priorité
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="relative text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium group"
            >
              {t.services}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#hospitals"
              className="relative text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium group"
            >
              {t.hospitals}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#faq"
              className="relative text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications - Only show if user is authenticated */}
            {!isLoading && isAuthenticated && user && (
              <NotificationsDropdown />
            )}

            {/* Language Toggle */}
            {onToggleLanguage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLanguage}
                className="hidden sm:flex items-center space-x-1 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 rounded-lg"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-600">{language.toUpperCase()}</span>
              </Button>
            )}

            {/* Theme Toggle */}
            {onToggleTheme && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleTheme} 
                className="hidden sm:flex hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-lg"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </Button>
            )}

            {/* Authentication Section */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  // User is logged in - show user dropdown
                  <UserDropdown />
                ) : (
                  // User is not logged in - show login buttons
                  <>
                    <Link href="/doctor-portal">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden lg:flex bg-transparent border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-400 transition-all duration-300 font-medium"
                      >
                        {t.doctorSpace}
                      </Button>
                    </Link>

                    <Link href="/login">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hidden md:flex bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-300 font-medium"
                      >
                        {t.login}
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-700/50 py-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-6">
              <a
                href="#services"
                className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.services}
              </a>
              <a
                href="#hospitals"
                className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.hospitals}
              </a>
              <a
                href="#faq"
                className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 font-medium px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              
              {!isAuthenticated && (
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
                  <Link href="/doctor-portal" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300">
                      {t.doctorSpace}
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                      {t.login}
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300">
                      Prendre RDV
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}