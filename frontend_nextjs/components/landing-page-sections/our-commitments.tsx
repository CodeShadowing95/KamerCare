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
      stats: {
        title: "Notre Impact",
        items: [
          { number: "500K+", label: "Patients servis" },
          { number: "1000+", label: "Médecins partenaires" },
          { number: "50+", label: "Hôpitaux connectés" },
          { number: "99.9%", label: "Disponibilité" }
        ]
      },
      cta: {
        title: "Rejoignez notre communauté de santé",
        description: "Faites confiance à la plateforme officielle du Ministère de la Santé",
        button: "Commencer maintenant"
      }
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
      stats: {
        title: "Our Impact",
        items: [
          { number: "500K+", label: "Patients served" },
          { number: "1000+", label: "Partner doctors" },
          { number: "50+", label: "Connected hospitals" },
          { number: "99.9%", label: "Availability" }
        ]
      },
      cta: {
        title: "Join our health community",
        description: "Trust the official platform of the Ministry of Health",
        button: "Get started now"
      }
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {t.commitments.map((commitment, index) => {
            const IconComponent = commitment.icon
            return (
              <div key={index} className="group">
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden relative">
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${commitment.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${commitment.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`bg-${commitment.color}-100 text-${commitment.color}-700 dark:bg-${commitment.color}-900 dark:text-${commitment.color}-300 font-medium`}
                      >
                        {commitment.badge}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-${commitment.color}-600 dark:group-hover:text-${commitment.color}-400 transition-colors duration-300`}>
                      {commitment.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {commitment.description}
                    </p>

                    {/* Decorative element */}
                    <div className="mt-6 flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 text-${commitment.color}-500`} />
                      <div className={`flex-1 h-0.5 bg-gradient-to-r from-${commitment.color}-200 to-transparent dark:from-${commitment.color}-800`}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Statistics Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-700 mb-16">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t.stats.title}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.items.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {stat.label}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-emerald-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t.cta.title}
              </h3>
              <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
                {t.cta.description}
              </p>
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-slate-100 hover:text-emerald-700 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                {t.cta.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}