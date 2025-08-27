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
  Search,
  Scissors,
  UserCheck,
  Microscope,
  Pill,
  Shield,
  Thermometer,
  Syringe,
  HeartHandshake,
  Scan,
  FlaskConical,
  Dna,
  Globe
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
        // Médecine Générale
        { 
          name: "Médecine Générale", 
          icon: Stethoscope, 
          bgGradient: "from-blue-500 to-indigo-500", 
          available: true,
          title: "Médecine Générale",
          description: "Premier contact avec le système de santé. Soins primaires complets, prévention et orientation."
        },
        // Spécialités chirurgicales et interventionnelles
        { 
          name: "Anesthésie/Réanimation", 
          icon: Activity, 
          bgGradient: "from-red-500 to-pink-500", 
          available: true,
          title: "Anesthésie/Réanimation",
          description: "Gestion de l'anesthésie et réanimation des patients en situation critique."
        },
        { 
          name: "Chirurgie générale", 
          icon: Scissors, 
          bgGradient: "from-gray-500 to-slate-500", 
          available: true,
          title: "Chirurgie Générale",
          description: "Interventions chirurgicales sur l'abdomen, la peau et les tissus mous."
        },
        { 
          name: "Chirurgie pédiatrique", 
          icon: Baby, 
          bgGradient: "from-pink-400 to-rose-400", 
          available: true,
          title: "Chirurgie Pédiatrique",
          description: "Chirurgie spécialisée pour les enfants et adolescents."
        },
        { 
          name: "Gynécologie/Obstétrique", 
          icon: HeartHandshake, 
          bgGradient: "from-purple-400 to-pink-400", 
          available: true,
          title: "Gynécologie/Obstétrique",
          description: "Santé féminine, grossesse et accouchement."
        },
        { 
          name: "Ophtalmologie", 
          icon: Eye, 
          bgGradient: "from-cyan-500 to-blue-500", 
          available: true,
          title: "Ophtalmologie",
          description: "Soins oculaires, chirurgie de la vision et traitements des pathologies oculaires."
        },
        { 
          name: "Oto-rhino-laryngologie (ORL)", 
          icon: UserCheck, 
          bgGradient: "from-teal-500 to-green-500", 
          available: true,
          title: "ORL",
          description: "Troubles de l'oreille, du nez, de la gorge et de la sphère ORL."
        },
        // Spécialités médicales internes
        { 
          name: "Cardiologie", 
          icon: Heart, 
          bgGradient: "from-red-500 to-rose-500", 
          available: true,
          title: "Cardiologie",
          description: "Maladies cardiovasculaires, prévention et traitements du cœur."
        },
        { 
          name: "Dermatologie/Vénérologie", 
          icon: Shield, 
          bgGradient: "from-orange-400 to-yellow-400", 
          available: true,
          title: "Dermatologie",
          description: "Pathologies de la peau et maladies sexuellement transmissibles."
        },
        { 
          name: "Endocrinologie/Diabétologie", 
          icon: Pill, 
          bgGradient: "from-emerald-500 to-teal-500", 
          available: true,
          title: "Endocrinologie",
          description: "Troubles hormonaux, diabète et maladies métaboliques."
        },
        { 
          name: "Gastroentérologie/Hépatologie", 
          icon: Thermometer, 
          bgGradient: "from-amber-500 to-orange-500", 
          available: true,
          title: "Gastroentérologie",
          description: "Maladies digestives, du foie et du système gastro-intestinal."
        },
        { 
          name: "Hématologie clinique", 
          icon: Syringe, 
          bgGradient: "from-red-600 to-pink-600", 
          available: true,
          title: "Hématologie",
          description: "Maladies du sang, anémies et troubles de la coagulation."
        },
        { 
          name: "Maladies infectieuses", 
          icon: Shield, 
          bgGradient: "from-green-600 to-emerald-600", 
          available: true,
          title: "Maladies Infectieuses",
          description: "Prévention et traitement des infections bactériennes et virales."
        },
        { 
          name: "Médecine interne", 
          icon: Stethoscope, 
          bgGradient: "from-indigo-500 to-purple-500", 
          available: true,
          title: "Médecine Interne",
          description: "Diagnostic et traitement des maladies complexes de l'adulte."
        },
        { 
          name: "Néphrologie", 
          icon: Activity, 
          bgGradient: "from-blue-600 to-cyan-600", 
          available: true,
          title: "Néphrologie",
          description: "Maladies rénales, dialyse et transplantation rénale."
        },
        { 
          name: "Neurologie", 
          icon: Brain, 
          bgGradient: "from-purple-500 to-indigo-500", 
          available: true,
          title: "Neurologie",
          description: "Troubles du système nerveux, cerveau et moelle épinière."
        },
        { 
          name: "Oncologie médicale", 
          icon: Scan, 
          bgGradient: "from-slate-600 to-gray-600", 
          available: true,
          title: "Oncologie",
          description: "Diagnostic et traitement des cancers par chimiothérapie."
        },
        { 
          name: "Pédiatrie", 
          icon: Baby, 
          bgGradient: "from-pink-500 to-rose-500", 
          available: true,
          title: "Pédiatrie",
          description: "Médecine des enfants de la naissance à l'adolescence."
        },
        { 
          name: "Psychiatrie", 
          icon: Brain, 
          bgGradient: "from-violet-500 to-purple-500", 
          available: true,
          title: "Psychiatrie",
          description: "Troubles mentaux, dépression, anxiété et santé psychique."
        },
        // Spécialités de biologie et diagnostic
        { 
          name: "Anatomopathologie", 
          icon: Microscope, 
          bgGradient: "from-gray-500 to-slate-600", 
          available: true,
          title: "Anatomopathologie",
          description: "Analyse microscopique des tissus pour le diagnostic."
        },
        { 
          name: "Biochimie médicale", 
          icon: FlaskConical, 
          bgGradient: "from-green-500 to-teal-500", 
          available: true,
          title: "Biochimie Médicale",
          description: "Analyses biologiques et interprétation des résultats de laboratoire."
        },
        { 
          name: "Biologie clinique", 
          icon: Dna, 
          bgGradient: "from-cyan-500 to-blue-600", 
          available: true,
          title: "Biologie Clinique",
          description: "Examens biologiques pour le diagnostic et suivi médical."
        },
        { 
          name: "Radiologie et imagerie médicale", 
          icon: Zap, 
          bgGradient: "from-yellow-500 to-orange-500", 
          available: true,
          title: "Radiologie",
          description: "Imagerie médicale : IRM, scanner, échographie, radiographie."
        },
        // Spécialités transversales
        { 
          name: "Santé publique", 
          icon: Globe, 
          bgGradient: "from-emerald-600 to-green-600", 
          available: true,
          title: "Santé Publique",
          description: "Prévention, épidémiologie et promotion de la santé collective."
        }
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
      <div className="container mx-auto px-4 lg:px-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon
            return (
              <div key={index} className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-slate-200 dark:border-slate-700">
                  {/* Image/Icon Section */}
                  <div className={`relative h-48 bg-gradient-to-br ${specialty.bgGradient} flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-white drop-shadow-lg" />
                    
                    {/* Availability badge */}
                    {specialty.available && (
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-xs font-medium">
                            {language === 'fr' ? 'Disponible' : 'Available'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2">
                      {specialty.name}
                    </h3>
                  </div>
                  
                  {/* Overlay with description on hover */}
                  <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <IconComponent className="w-12 h-12 text-white mx-auto mb-4 opacity-80" />
                      <h4 className="text-white font-bold text-lg mb-3">
                        {specialty.name}
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed mb-4">
                        {(language === 'fr' ? 'Spécialité médicale disponible dans nos centres.' : 'Medical specialty available in our centers.')}
                      </p>
                      <div className="inline-flex items-center text-emerald-400 text-sm font-medium">
                        <span>{language === 'fr' ? 'En savoir plus' : 'Learn more'}</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
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