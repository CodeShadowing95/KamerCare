"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  Shield,
  Clock,
  Award,
  ChevronRight,
  UserCheck,
  Activity,
  Clipboard,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoctorNavbar, DoctorHero, DoctorFeatures, DoctorBenefits, DoctorCTA, DoctorFooter } from "@/components/doctor/landing-page-sections"

export default function DoctorPortalLanding() {
  const [language, setLanguage] = useState("fr")
  const [isDark, setIsDark] = useState(false)

  const texts = {
    fr: {
      title: "Plateforme Professionnelle de Santé",
      subtitle: "Gérez vos consultations et patients avec efficacité",
      loginDoctor: "Connexion Médecin",
      registerDoctor: "Inscription Médecin",
      patientPortal: "Espace Patient",
      features: "Fonctionnalités",
      benefits: "Avantages",
      stats: "Statistiques",
      getStarted: "Commencer",
    },
    en: {
      title: "Professional Healthcare Platform",
      subtitle: "Manage your consultations and patients efficiently",
      loginDoctor: "Doctor Login",
      registerDoctor: "Doctor Registration",
      patientPortal: "Patient Portal",
      features: "Features",
      benefits: "Benefits",
      stats: "Statistics",
      getStarted: "Get Started",
    },
  }

  const t = texts[language as keyof typeof texts]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr")
  }

  const features = [
    {
      icon: Calendar,
      title: "Gestion des Rendez-vous",
      description: "Planifiez et gérez vos consultations en temps réel",
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      title: "Dossiers Patients",
      description: "Accès sécurisé aux dossiers médicaux complets",
      color: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: FileText,
      title: "Prescriptions Digitales",
      description: "Créez et envoyez des ordonnances électroniques",
      color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    },
    {
      icon: BarChart3,
      title: "Rapports & Analytics",
      description: "Suivez vos performances et statistiques médicales",
      color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Conformité HIPAA et chiffrement de bout en bout",
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Réduisez le temps administratif de 40%",
    },
    {
      icon: Award,
      title: "Qualité des Soins",
      description: "Améliorez la qualité des soins grâce aux outils digitaux",
    },
    {
      icon: Activity,
      title: "Suivi en Temps Réel",
      description: "Monitoring continu de l'état de vos patients",
    },
  ]

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Enhanced Doctor Navbar */}
      <DoctorNavbar
        language={language}
        isDark={isDark}
        toggleLanguage={toggleLanguage}
        toggleTheme={toggleTheme}
        isAuthenticated={false}
      />

      {/* Enhanced Hero Section */}
      <DoctorHero language={language} t={t} />

      {/* Enhanced Features Section */}
      <DoctorFeatures language={language} t={t} />

      {/* Enhanced Benefits Section */}
      <DoctorBenefits language={language} t={t} />

      {/* Enhanced CTA Section */}
      <DoctorCTA language={language} t={t} />

      {/* Footer */}
      <DoctorFooter language="fr" />
    </div>
  )
}
