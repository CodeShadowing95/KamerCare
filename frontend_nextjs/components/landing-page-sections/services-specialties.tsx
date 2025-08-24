"use client"

import { 
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby, 
  Stethoscope, 
  Activity, 
  Zap, 
  Users, 
  Clock, 
  Award, 
  Search 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServicesSpecialtiesProps {
  language: 'fr' | 'en'
}

export default function ServicesSpecialties({ language }: ServicesSpecialtiesProps) {
  const content = {
    fr: {
      title: "Services & spécialités",
      subtitle: "Découvrez notre large gamme de services médicaux et spécialités disponibles dans tout le Cameroun",
      specialties: [
        { name: "Cardiologie", icon: Heart, bgGradient: "from-red-500 to-pink-500", available: true },
        { name: "Neurologie", icon: Brain, bgGradient: "from-purple-500 to-indigo-500", available: true },
        { name: "Ophtalmologie", icon: Eye, bgGradient: "from-blue-500 to-cyan-500", available: true },
        { name: "Orthopédie", icon: Bone, bgGradient: "from-orange-500 to-red-500", available: true },
        { name: "Pédiatrie", icon: Baby, bgGradient: "from-pink-500 to-rose-500", available: true },
        { name: "Médecine générale", icon: Stethoscope, bgGradient: "from-emerald-500 to-teal-500", available: true },
        { name: "Urgences", icon: Activity, bgGradient: "from-red-500 to-orange-500", available: true },
        { name: "Radiologie", icon: Zap, bgGradient: "from-yellow-500 to-orange-500", available: true }
      ],
      stats: {
        doctors: "500+ Médecins",
        doctorsDesc: "Spécialistes qualifiés",
        availability: "24h/7j",
        availabilityDesc: "Service d'urgence",
        certified: "Certifié",
        certifiedDesc: "Normes internationales"
      },
      searchButton: "Rechercher un spécialiste"
    },
    en: {
      title: "Services & Specialties",
      subtitle: "Discover our wide range of medical services and specialties available throughout Cameroon",
      specialties: [
        { name: "Cardiology", icon: Heart, bgGradient: "from-red-500 to-pink-500", available: true },
        { name: "Neurology", icon: Brain, bgGradient: "from-purple-500 to-indigo-500", available: true },
        { name: "Ophthalmology", icon: Eye, bgGradient: "from-blue-500 to-cyan-500", available: true },
        { name: "Orthopedics", icon: Bone, bgGradient: "from-orange-500 to-red-500", available: true },
        { name: "Pediatrics", icon: Baby, bgGradient: "from-pink-500 to-rose-500", available: true },
        { name: "General Medicine", icon: Stethoscope, bgGradient: "from-emerald-500 to-teal-500", available: true },
        { name: "Emergency", icon: Activity, bgGradient: "from-red-500 to-orange-500", available: true },
        { name: "Radiology", icon: Zap, bgGradient: "from-yellow-500 to-orange-500", available: true }
      ],
      stats: {
        doctors: "500+ Doctors",
        doctorsDesc: "Qualified specialists",
        availability: "24/7",
        availabilityDesc: "Emergency service",
        certified: "Certified",
        certifiedDesc: "International standards"
      },
      searchButton: "Search for a specialist"
    }
  }

  const { title, subtitle, specialties, stats, searchButton } = content[language]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon
            return (
              <div key={index} className="group">
                <Card className="h-full border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${specialty.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Specialty name */}
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">
                      {specialty.name}
                    </h3>
                    
                    {/* Availability indicator */}
                    {specialty.available && (
                      <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{language === 'fr' ? 'Disponible' : 'Available'}</span>
                      </div>
                    )}
                    
                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${specialty.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`}></div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
        
        {/* Additional info section */}
        <div className="text-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{stats.doctors}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stats.doctorsDesc}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{stats.availability}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stats.availabilityDesc}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{stats.certified}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{stats.certifiedDesc}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="w-5 h-5 mr-2" />
                {searchButton}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}