"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Globe,
    Moon,
    Sun,
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    Shield,
    Activity,
    Calendar,
    FileText,
    BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface DoctorNavbarProps {
    language: string
    isDark: boolean
    toggleLanguage: () => void
    toggleTheme: () => void
    isAuthenticated?: boolean
    userProfile?: {
        name: string
        avatar?: string
        specialty: string
        notifications: number
    }
}

export default function DoctorNavbar({
    language,
    isDark,
    toggleLanguage,
    toggleTheme,
    isAuthenticated = false,
    userProfile,
}: DoctorNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Translations
    const t = {
        fr: {
            professionalSpace: "Espace Professionnel",
            healthMinistry: "Ministère de la Santé Publique",
            features: "Fonctionnalités",
            benefits: "Avantages",
            statistics: "Statistiques",
            dashboard: "Tableau de bord",
            appointments: "Rendez-vous",
            patients: "Patients",
            reports: "Rapports",
            patientPortal: "Portail Patient",
            loginDoctor: "Connexion",
            searchPlaceholder: "Rechercher...",
            profile: "Profil",
            settings: "Paramètres",
            logout: "Déconnexion",
            notifications: "Notifications",
        },
        en: {
            professionalSpace: "Professional Space",
            healthMinistry: "Ministry of Public Health",
            features: "Features",
            benefits: "Benefits",
            statistics: "Statistics",
            dashboard: "Dashboard",
            appointments: "Appointments",
            patients: "Patients",
            reports: "Reports",
            patientPortal: "Patient Portal",
            loginDoctor: "Login",
            searchPlaceholder: "Search...",
            profile: "Profile",
            settings: "Settings",
            logout: "Logout",
            notifications: "Notifications",
        },
    }

    const currentLang = t[language as keyof typeof t] || t.fr

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navigationItems = [
        { href: "#features-section", label: currentLang.features, icon: Activity },
        { href: "#benefits-section", label: currentLang.benefits, icon: Shield },
        { href: "#cta-section", label: currentLang.statistics, icon: BarChart3 },
    ]

    const authenticatedNavItems = [
        { href: "/doctor/dashboard", label: currentLang.dashboard, icon: BarChart3 },
        { href: "/doctor/appointments", label: currentLang.appointments, icon: Calendar },
        { href: "/doctor/patients", label: currentLang.patients, icon: User },
        { href: "/doctor/reports", label: currentLang.reports, icon: FileText },
    ]

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/98 dark:bg-slate-900/98 backdrop-blur-md shadow-lg border-b border-border/50"
                    : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-border"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <Link href="/doctor-portal" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 p-1">
                                <img 
                                    src="/KamerCare-logo.png" 
                                    alt="KamerCare Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                KamerCare
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {currentLang.professionalSpace}
                            </div>
                        </div>
                    </Link>

                    {/* Search Bar (for authenticated users) */}
                    {isAuthenticated && (
                        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={currentLang.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                />
                            </div>
                        </div>
                    )}

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {isAuthenticated
                            ? authenticatedNavItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </Button>
                                    </Link>
                                )
                            })
                            : navigationItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <a key={item.href} href={item.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </Button>
                                    </a>
                                )
                            })
                        }
                    </nav>

                    {/* Controls Section */}
                    <div className="flex items-center space-x-2">
                        {/* Language Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center space-x-1 hover:bg-primary/10 transition-all duration-200"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="font-medium">{language.toUpperCase()}</span>
                        </Button>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="hidden sm:flex hover:bg-primary/10 transition-all duration-200"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-yellow-500" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-600" />
                            )}
                        </Button>

                        {isAuthenticated && userProfile ? (
                            <>
                                {/* Notifications */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative hidden sm:flex hover:bg-primary/10 transition-all duration-200"
                                >
                                    <Bell className="w-4 h-4" />
                                    {userProfile.notifications > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0 animate-pulse"
                                        >
                                            {userProfile.notifications}
                                        </Badge>
                                    )}
                                </Button>

                                {/* User Profile Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex items-center space-x-2 hover:bg-primary/10 transition-all duration-200 p-2"
                                        >
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                                                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                                    {userProfile.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="hidden lg:block text-left">
                                                <div className="text-sm font-medium">{userProfile.name}</div>
                                                <div className="text-xs text-muted-foreground">{userProfile.specialty}</div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{userProfile.name}</p>
                                                <p className="text-xs text-muted-foreground">{userProfile.specialty}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{currentLang.profile}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>{currentLang.settings}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Bell className="mr-2 h-4 w-4" />
                                            <span>{currentLang.notifications}</span>
                                            {userProfile.notifications > 0 && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    {userProfile.notifications}
                                                </Badge>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>{currentLang.logout}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                {/* Patient Portal Link */}
                                <Link href="/" className="hidden md:block">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hidden lg:flex bg-transparent border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-400 transition-all duration-300 font-medium"
                                    >
                                        {currentLang.patientPortal}
                                    </Button>
                                </Link>

                                {/* Login Button */}
                                <Link href="/doctor/login" className="hidden md:block">
                                    <Button
                                        variant="outline" 
                                        size="sm" 
                                        className="hidden md:flex bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-300 font-medium"
                                    >
                                        {currentLang.loginDoctor}
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden hover:bg-primary/10 transition-all duration-200"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
                        {/* Mobile Search */}
                        {isAuthenticated && (
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={currentLang.searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col space-y-2">
                            {isAuthenticated
                                ? authenticatedNavItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </Button>
                                        </Link>
                                    )
                                })
                                : navigationItems.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <a key={item.href} href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </Button>
                                        </a>
                                    )
                                })
                            }

                            {!isAuthenticated && (
                                <>
                                    <div className="border-t border-border/50 my-2" />
                                    <Link href="/">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {currentLang.patientPortal}
                                        </Button>
                                    </Link>
                                    <Link href="/doctor/login">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {currentLang.loginDoctor}
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Controls */}
                            <div className="border-t border-border/50 my-2" />
                            <div className="flex items-center justify-between px-3 py-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleLanguage}
                                    className="flex items-center space-x-2"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>{language.toUpperCase()}</span>
                                </Button>
                                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}