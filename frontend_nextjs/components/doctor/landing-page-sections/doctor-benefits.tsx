"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Clock,
  Award,
  UserCheck,
  Activity,
  Clipboard,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  Zap
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorBenefitsProps {
  language: string
  t: {
    benefits: string
  }
}

export default function DoctorBenefits({ language, t }: DoctorBenefitsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('benefits-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const benefits = [
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Conformité RGPD et chiffrement de bout en bout pour protéger vos données médicales",
      color: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      features: ["Chiffrement AES-256", "Authentification 2FA", "Audit de sécurité"]
    },
    {
      icon: Clock,
      title: "Gain de Temps",
      description: "Automatisation des tâches répétitives pour vous concentrer sur vos patients",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      features: ["Rappels automatiques", "Templates prédéfinis", "Synchronisation temps réel"]
    },
    {
      icon: Award,
      title: "Certification Officielle",
      description: "Plateforme certifiée par le Ministère de la Santé du Cameroun",
      color: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      features: ["Certification HAS", "Normes ISO 27001", "Validation ministérielle"]
    },
    {
      icon: UserCheck,
      title: "Support Dédié",
      description: "Équipe de support technique disponible 24h/7j pour vous accompagner",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      features: ["Support 24/7", "Formation personnalisée", "Assistance technique"]
    },
  ]

  return (
    <section id="benefits-section" className="relative py-16 px-4 lg:px-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-emerald-400/8 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-amber-400/6 to-orange-400/4 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-32 animate-float-gentle">
          <div className="w-16 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-xl border border-white/50 dark:border-slate-700/50">
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div className="absolute bottom-40 left-20 animate-float-gentle delay-1500">
          <div className="w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/40 dark:border-slate-700/40">
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/3 animate-float-gentle delay-3000">
          <div className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-md border border-white/30 dark:border-slate-700/30">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge className="inline-flex items-center px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-full mb-6">
            <Award className="w-4 h-4 mr-2 text-amber-500" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Avantages Exclusifs
            </span>
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-300 bg-clip-text text-transparent">
              Pourquoi Nous Choisir ?
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Découvrez les avantages uniques qui font de notre plateforme le choix privilégié de plus de 2,500 médecins au Cameroun
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`transition-all duration-700 delay-${index * 150} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              onMouseEnter={() => setHoveredBenefit(index)}
              onMouseLeave={() => setHoveredBenefit(null)}
            >
              <Card className={`h-64 bg-gradient-to-br ${benefit.bgGradient} border border-white/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 group relative overflow-hidden cursor-pointer backdrop-blur-xl`}>
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-slate-800/95 dark:via-slate-800/90 dark:to-slate-800/85 backdrop-blur-xl" />
                
                {/* Elegant Border Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`} />
                <div className="absolute inset-[1px] bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 rounded-lg" />
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
                </div>
                
                {/* Default State - Only Title */}
                <CardContent className={`p-6 relative z-10 flex items-center justify-center h-full transition-all duration-300 ${hoveredBenefit === index ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl ${benefit.iconBg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 text-center leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                      {benefit.title}
                    </h3>
                  </div>
                </CardContent>
                
                {/* Hover Overlay - Enhanced Description */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} flex flex-col items-center justify-center p-6 text-white transition-all duration-500 ${hoveredBenefit === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                  <div className="text-center transform transition-all duration-500 delay-100">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-sm font-bold mb-3 text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-center leading-relaxed font-medium text-white/90 mb-3">
                      {benefit.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {benefit.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-1 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${benefit.color} opacity-20 transform rotate-45 translate-x-6 -translate-y-6 group-hover:opacity-40 transition-opacity duration-300`} />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom Statistics */}
        <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-slate-700/50 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                2,500+
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Médecins Actifs</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Satisfaction Client</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium text-sm">Support Technique</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
        .group:hover .shadow-3xl {
          box-shadow: 0 45px 80px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  )
}