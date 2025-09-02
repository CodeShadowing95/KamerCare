"use client"

import Link from "next/link"
import { Calendar, Users, ArrowRight, Sparkles, CheckCircle, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReadyToBookCTAProps {
  language: 'fr' | 'en'
}

export default function ReadyToBookCTA({ language }: ReadyToBookCTAProps) {
  const texts = {
    fr: {
      title: "Prêt à prendre rendez-vous ?",
      subtitle: "Rejoignez les milliers de Camerounais qui utilisent déjà notre plateforme",
      description: "Accédez facilement aux soins de santé publique avec notre système de réservation moderne et sécurisé.",
      createAccount: "Créer un compte",
      bookAppointment: "Prendre rendez-vous",
      features: [
        {
          icon: CheckCircle,
          text: "Gratuit et sécurisé"
        },
        {
          icon: Clock,
          text: "Disponible 24h/24"
        },
        {
          icon: Shield,
          text: "Données protégées"
        }
      ],
      stats: {
        users: "50K+ utilisateurs",
        appointments: "200K+ RDV pris",
        satisfaction: "98% satisfaction"
      },
      trustBadge: "Plateforme officielle"
    },
    en: {
      title: "Ready to book an appointment?",
      subtitle: "Join thousands of Cameroonians already using our platform",
      description: "Easily access public healthcare with our modern and secure booking system.",
      createAccount: "Create Account",
      bookAppointment: "Book Appointment",
      features: [
        {
          icon: CheckCircle,
          text: "Free and secure"
        },
        {
          icon: Clock,
          text: "Available 24/7"
        },
        {
          icon: Shield,
          text: "Data protected"
        }
      ],
      stats: {
        users: "50K+ users",
        appointments: "200K+ appointments",
        satisfaction: "98% satisfaction"
      },
      trustBadge: "Official platform"
    }
  }

  const t = texts[language]

  return (
    <section className="py-20 relative overflow-hidden" style={{backgroundImage: 'url(/caring-doctor.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 via-emerald-700/80 to-blue-800/80 dark:from-emerald-800/80 dark:via-emerald-900/80 dark:to-blue-950/80 z-0"></div>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-emerald-300/50 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-16">
            {/* Trust badge */}
            <div className="inline-flex items-center mb-6">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                {t.trustBadge}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t.title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-emerald-100 mb-4 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-lg text-emerald-200/80 mb-12 max-w-2xl mx-auto">
              {t.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {t.features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-2 text-white/90">
                    <IconComponent className="w-5 h-5 text-emerald-300" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 font-semibold text-lg group"
                >
                  <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  {t.createAccount}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white hover:text-emerald-600 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 font-semibold text-lg group"
                >
                  <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  {t.bookAppointment}
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="text-2xl font-bold mb-2">{t.stats.users.split(' ')[0]}</div>
                <div className="text-emerald-200 text-sm font-medium">{t.stats.users.split(' ').slice(1).join(' ')}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 md:scale-110">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-300" />
                </div>
                <div className="text-2xl font-bold mb-2">{t.stats.appointments.split(' ')[0]}</div>
                <div className="text-blue-200 text-sm font-medium">{t.stats.appointments.split(' ').slice(1).join(' ')}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold mb-2">{t.stats.satisfaction.split(' ')[0]}</div>
                <div className="text-yellow-200 text-sm font-medium">{t.stats.satisfaction.split(' ').slice(1).join(' ')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom decorative element */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-2 text-white/60">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-white/40"></div>
              <Sparkles className="w-4 h-4" />
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-white/40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}