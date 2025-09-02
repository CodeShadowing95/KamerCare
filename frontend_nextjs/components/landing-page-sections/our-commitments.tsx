"use client"

import { Shield, Clock, Award, Users, Heart, CheckCircle, Star, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface OurCommitmentsProps {
  language: 'fr' | 'en'
}

export default function OurCommitments({ language }: OurCommitmentsProps) {
  const texts = {
    fr: {
      title: "Nos Engagements",
      subtitle: "Des valeurs fortes au service de votre santé et de votre bien-être",
      commitments: [
        {
          icon: Shield,
          title: "100% Gratuit",
          description: "Service entièrement gratuit du gouvernement camerounais pour tous les citoyens",
          color: "emerald",
          gradient: "from-emerald-400 to-emerald-600",
          badge: "Garanti"
        },
        {
          icon: Clock,
          title: "Disponible 24/7",
          description: "Prenez rendez-vous à toute heure, notre plateforme est accessible en permanence",
          color: "blue",
          gradient: "from-blue-400 to-blue-600",
          badge: "Non-stop"
        },
        {
          icon: Award,
          title: "Sécurisé & Confidentiel",
          description: "Vos données personnelles et médicales sont protégées selon les normes internationales",
          color: "purple",
          gradient: "from-purple-400 to-purple-600",
          badge: "Certifié"
        },
        {
          icon: Users,
          title: "Accessible à Tous",
          description: "Service inclusif pour tous les citoyens camerounais, sans discrimination",
          color: "orange",
          gradient: "from-orange-400 to-orange-600",
          badge: "Inclusif"
        },
        {
          icon: Heart,
          title: "Qualité des Soins",
          description: "Médecins qualifiés et équipements modernes dans tout le réseau hospitalier",
          color: "rose",
          gradient: "from-rose-400 to-rose-600",
          badge: "Excellence"
        },
        {
          icon: Globe,
          title: "Couverture Nationale",
          description: "Présent dans toutes les régions du Cameroun pour vous servir au plus près",
          color: "teal",
          gradient: "from-teal-400 to-teal-600",
          badge: "National"
        }
      ],
    },
    en: {
      title: "Our Commitments",
      subtitle: "Strong values serving your health and well-being",
      commitments: [
        {
          icon: Shield,
          title: "100% Free",
          description: "Completely free government service for all Cameroonian citizens",
          color: "emerald",
          gradient: "from-emerald-400 to-emerald-600",
          badge: "Guaranteed"
        },
        {
          icon: Clock,
          title: "Available 24/7",
          description: "Book appointments anytime, our platform is permanently accessible",
          color: "blue",
          gradient: "from-blue-400 to-blue-600",
          badge: "Non-stop"
        },
        {
          icon: Award,
          title: "Secure & Confidential",
          description: "Your personal and medical data are protected according to international standards",
          color: "purple",
          gradient: "from-purple-400 to-purple-600",
          badge: "Certified"
        },
        {
          icon: Users,
          title: "Accessible to All",
          description: "Inclusive service for all Cameroonian citizens, without discrimination",
          color: "orange",
          gradient: "from-orange-400 to-orange-600",
          badge: "Inclusive"
        },
        {
          icon: Heart,
          title: "Quality Care",
          description: "Qualified doctors and modern equipment throughout the hospital network",
          color: "rose",
          gradient: "from-rose-400 to-rose-600",
          badge: "Excellence"
        },
        {
          icon: Globe,
          title: "National Coverage",
          description: "Present in all regions of Cameroon to serve you closer",
          color: "teal",
          gradient: "from-teal-400 to-teal-600",
          badge: "National"
        }
      ],
    }
  }

  const t = texts[language]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-emerald-200/30 dark:from-blue-800/20 dark:to-emerald-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-32 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Commitments - Modern Timeline Design */}
        <div className="relative mb-20">
          {/* Central vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 via-blue-500 to-purple-600 rounded-full hidden lg:block"></div>
          
          <div className="space-y-16">
            {t.commitments.map((commitment, index) => {
              const IconComponent = commitment.icon
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:gap-16 gap-8`}>
                  {/* Central icon for timeline */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
                    <div className={`w-20 h-20 bg-gradient-to-br ${commitment.gradient} rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800 group-hover:scale-110 transition-all duration-500`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  {/* Content card */}
                  <div className={`lg:w-5/12 w-full group ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    <div className="relative">
                      {/* Floating background element */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${commitment.gradient} opacity-5 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-all duration-700`}></div>
                      
                      <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-slate-700/50">
                        {/* Mobile icon */}
                        <div className="lg:hidden flex justify-center mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${commitment.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Badge */}
                        <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${commitment.gradient} text-white text-sm font-semibold mb-4 shadow-lg`}>
                          <Star className="w-4 h-4 mr-2" />
                          {commitment.badge}
                        </div>
                        
                        {/* Title with gradient text */}
                        <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${commitment.gradient} bg-clip-text text-transparent`}>
                          {commitment.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                          {commitment.description}
                        </p>
                        
                        {/* Decorative line */}
                        <div className={`h-1 bg-gradient-to-r ${commitment.gradient} rounded-full w-20 ${isEven ? 'lg:ml-auto' : 'lg:mr-auto'} mx-auto lg:mx-0 opacity-60`}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for the other side */}
                  <div className="lg:w-5/12 hidden lg:block"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}