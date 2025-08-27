"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Zap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorFeaturesProps {
  language: string
  t: {
    features: string
  }
}

export default function DoctorFeatures({ language, t }: DoctorFeaturesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('features-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Calendar,
      title: "Gestion des Rendez-vous",
      description: "Planifiez et gérez vos consultations en temps réel avec un système intelligent",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      benefits: ["Calendrier intelligent", "Rappels automatiques", "Synchronisation multi-appareils"]
    },
    {
      icon: Users,
      title: "Dossiers Patients",
      description: "Accès sécurisé aux dossiers médicaux complets avec historique détaillé",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      benefits: ["Historique complet", "Recherche avancée", "Partage sécurisé"]
    },
    {
      icon: FileText,
      title: "Prescriptions Digitales",
      description: "Créez et envoyez des ordonnances électroniques conformes aux standards",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      benefits: ["Signature électronique", "Base de données médicaments", "Envoi direct pharmacie"]
    },
    {
      icon: BarChart3,
      title: "Rapports & Analytics",
      description: "Suivez vos performances et statistiques médicales avec des tableaux de bord",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
      benefits: ["Tableaux de bord", "Métriques personnalisées", "Rapports automatisés"]
    },
  ]

  return (
    <section id="features-section" className="relative py-20 px-4 lg:px-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/8 to-cyan-400/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/6 to-pink-400/4 rounded-full blur-xl animate-pulse delay-2000" />
        
        {/* Floating Icons */}
        <div className="absolute top-16 right-20 animate-float-gentle">
          <div className="w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/40 dark:border-slate-700/40">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
        </div>
        
        <div className="absolute bottom-32 left-16 animate-float-gentle delay-1000">
          <div className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/30 dark:border-slate-700/30">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-full mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Fonctionnalités Avancées
            </span>
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-300 bg-clip-text text-transparent">
              {t.features} Professionnelles
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Des outils professionnels conçus pour optimiser votre pratique médicale et améliorer la qualité des soins
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className={`h-full ${feature.bgColor} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group relative overflow-hidden`}>
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm" />
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardHeader className="text-center relative z-10 pb-4">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Benefits List - Shown on Hover */}
                  <div className={`space-y-2 transition-all duration-500 ${hoveredCard === index ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <div className={`pt-4 transition-all duration-500 ${hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Button 
                      size="sm" 
                      className={`w-full bg-gradient-to-r ${feature.color} text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                    >
                      <span className="mr-2">En savoir plus</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Découvrez comment ces fonctionnalités peuvent transformer votre pratique médicale
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-400 px-8 py-4 text-lg font-medium rounded-xl border-0 group"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Planifier une Démonstration
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}