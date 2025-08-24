"use client"

import { Search, Calendar, Shield } from "lucide-react"

interface HowItWorksProps {
  language: 'fr' | 'en'
}

export default function HowItWorks({ language }: HowItWorksProps) {
  const content = {
    fr: {
      title: "Comment ça marche",
      subtitle: "Trouvez et réservez votre rendez-vous médical en 3 étapes simples",
      steps: [
        {
          icon: Search,
          title: "Recherchez",
          description: "Trouvez l'hôpital et le spécialiste qui vous conviennent selon votre région et vos besoins."
        },
        {
          icon: Calendar,
          title: "Réservez",
          description: "Choisissez un créneau disponible et confirmez votre rendez-vous en ligne facilement."
        },
        {
          icon: Shield,
          title: "Consultez",
          description: "Rendez-vous à votre consultation avec la garantie d'un service médical de qualité."
        }
      ]
    },
    en: {
      title: "How it works",
      subtitle: "Find and book your medical appointment in 3 simple steps",
      steps: [
        {
          icon: Search,
          title: "Search",
          description: "Find the hospital and specialist that suits you according to your region and needs."
        },
        {
          icon: Calendar,
          title: "Book",
          description: "Choose an available slot and confirm your appointment online easily."
        },
        {
          icon: Shield,
          title: "Consult",
          description: "Attend your consultation with the guarantee of quality medical service."
        }
      ]
    }
  }

  const { title, subtitle, steps } = content[language]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
                
                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300 dark:from-emerald-700 dark:to-blue-700 transform -translate-y-1/2 z-10">
                    <div className="absolute right-0 top-1/2 w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full transform -translate-y-1/2 translate-x-1"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}