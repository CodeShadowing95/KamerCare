'use client'

import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings, 
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  Star,
  Clock,
  Activity,
  Sun,
  Moon
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from 'next/link'

interface ContentHeaderProps {
  title: string
  subtitle: string
  showActions?: boolean
  showThemeToggle?: boolean
  showStats?: boolean
  stats?: {
    total?: number
    active?: number
    pending?: number
    growth?: string
  }
  actions?: {
    onExport?: () => void
    onRefresh?: () => void
    onSettings?: () => void
  }
}

const ContentHeader = ({ 
  title, 
  subtitle, 
  showActions = true,
  showThemeToggle = true,
  showStats = false,
  stats = {},
  actions = {}
}: ContentHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Détecter le thème actuel au chargement
  useEffect(() => {
    const checkTheme = () => {
      // Vérifier d'abord localStorage
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        const isDarkMode = savedTheme === 'dark'
        setIsDark(isDarkMode)
        document.documentElement.classList.toggle('dark', isDarkMode)
      } else {
        // Sinon, détecter le thème système
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(prefersDark)
        document.documentElement.classList.toggle('dark', prefersDark)
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light')
      }
    }
    
    checkTheme()
    
    // Observer les changements de classe sur l'élément html
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    actions.onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    
    // Sauvegarder la préférence dans localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  return (
    <header className="relative bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-800/80 border-b border-slate-200/60 dark:border-slate-700/50 px-8 py-6 backdrop-blur-sm overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 via-indigo-50/20 to-transparent dark:from-blue-900/20 dark:via-indigo-900/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-emerald-100/40 via-teal-50/30 to-transparent dark:from-emerald-900/20 dark:via-teal-900/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        {/* Main header content */}
        <div className="flex items-start justify-between">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent font-sans tracking-tight">
                {title}
              </h1>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs">
                <Activity className="w-2.5 h-2.5 mr-1" />
                En ligne
              </Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-base leading-relaxed">
              {subtitle}
            </p>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-500">
              <Link href="/admin">Administration</Link>
              <ChevronDown className="w-2.5 h-2.5 rotate-[-90deg]" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{title}</span>
            </div>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              {showThemeToggle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
                Actualiser
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onExport}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Bell className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={actions.onSettings}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total?.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Actifs</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active?.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">En attente</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
                </div>
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Croissance</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.growth}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default ContentHeader