"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Stethoscope,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Shield,
  Clock,
  Award,
  ChevronRight,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  UserCheck,
  Activity,
  Clipboard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorPortalLanding() {
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState("fr")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-foreground">Espace Professionnel</div>
                <div className="text-xs text-muted-foreground">Ministère de la Santé Publique</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                {t.features}
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-primary transition-colors">
                {t.benefits}
              </a>
              <a href="#stats" className="text-muted-foreground hover:text-primary transition-colors">
                {t.stats}
              </a>
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="hidden sm:flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span>{language.toUpperCase()}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex bg-transparent border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                >
                  {t.patientPortal}
                </Button>
              </Link>

              <Link href="/doctor/login">
                <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                  {t.loginDoctor}
                </Button>
              </Link>

              <Link href="/doctor/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  {t.registerDoctor}
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-muted-foreground hover:text-primary">
                  {t.features}
                </a>
                <a href="#benefits" className="text-muted-foreground hover:text-primary">
                  {t.benefits}
                </a>
                <a href="#stats" className="text-muted-foreground hover:text-primary">
                  {t.stats}
                </a>
                <div className="flex items-center space-x-4 pt-2">
                  <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                    <Globe className="w-4 h-4 mr-1" />
                    {language.toUpperCase()}
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4 mr-2" />
              Plateforme Certifiée Ministère de la Santé
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">{t.title}</h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">{t.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/doctor/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserCheck className="w-5 h-5 mr-2" />
                  {t.loginDoctor}
                </Button>
              </Link>
              <Link href="/doctor/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Clipboard className="w-5 h-5 mr-2" />
                  {t.registerDoctor}
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
                <div className="text-muted-foreground">Médecins Actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-muted-foreground">Hôpitaux Connectés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.features}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des outils professionnels conçus pour optimiser votre pratique médicale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t.benefits}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Pourquoi choisir notre plateforme professionnelle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez la révolution digitale de la santé</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Plus de 2,500 médecins font déjà confiance à notre plateforme pour améliorer leurs soins
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/doctor/signup">
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <ChevronRight className="w-5 h-5 mr-2" />
                {t.getStarted}
              </Button>
            </Link>
            <Link href="/doctor/login">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                {t.loginDoctor}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Espace Professionnel</div>
                  <div className="text-sm text-slate-400">Ministère de la Santé</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Plateforme professionnelle dédiée aux praticiens de santé du Cameroun.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Gestion des RDV</li>
                <li>Dossiers patients</li>
                <li>Prescriptions</li>
                <li>Rapports médicaux</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Documentation</li>
                <li>Formation</li>
                <li>Support technique</li>
                <li>FAQ Médecins</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Professionnel</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div>+237 222 23 40 19</div>
                <div>medecins@minsante.cm</div>
                <div>Support 24/7</div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 République du Cameroun - Ministère de la Santé Publique. Espace Professionnel.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
