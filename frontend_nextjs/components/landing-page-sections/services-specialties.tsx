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
      title: "Services & Spécialités",
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
          description: "Consultations pré-opératoires et gestion de la douleur. Anesthésie pour chirurgies et examens médicaux. Traitement des douleurs chroniques et aiguës. Techniques d'anesthésie locale, générale et péridurale. Sécurité optimale des patients garantie... Voir plus"
        },
        { 
          name: "Chirurgie générale", 
          icon: Scissors, 
          bgGradient: "from-gray-500 to-slate-500", 
          available: true,
          title: "Chirurgie Générale",
          description: "Consultations chirurgicales et interventions programmées. Chirurgie abdominale, hernies et appendicite. Cœlioscopie et techniques mini-invasives. Traitement calculs biliaires et tumeurs bénignes. Récupération rapide et suivi post-opératoire... Voir plus"
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
          description: "Consultations santé féminine et suivi gynécologique. Contraception, suivi grossesse et accouchement. Traitement infections et troubles hormonaux. Dépistage cancers gynécologiques et ménopause. Consultations confidentielles et bienveillantes... Voir plus"
        },
        { 
          name: "Ophtalmologie", 
          icon: Eye, 
          bgGradient: "from-cyan-500 to-blue-500", 
          available: true,
          title: "Ophtalmologie",
          description: "Consultations pour problèmes de vue et maladies oculaires. Examens de vue, lunettes et lentilles de contact. Traitement cataracte, glaucome, DMLA et infections. Chirurgie réfractive et fond d'œil. Urgences ophtalmologiques prises en charge... Voir plus"
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
          description: "Consultations spécialisées pour les maladies du cœur et vaisseaux. Prise en charge de l'hypertension, arythmies, insuffisance cardiaque. Examens cardiaques complets avec ECG et échographie. Suivi personnalisé des patients cardiaques. Prévention des risques cardiovasculaires... Voir plus"
        },
        { 
          name: "Dermatologie/Vénérologie", 
          icon: Shield, 
          bgGradient: "from-orange-400 to-yellow-400", 
          available: true,
          title: "Dermatologie",
          description: "Consultations pour problèmes de peau, cheveux et ongles. Traitement acné, eczéma, psoriasis, infections cutanées. Dépistage cancers de la peau et grains de beauté. Dermatologie esthétique et pédiatrique. Rendez-vous rapides disponibles... Voir plus"
        },
        { 
          name: "Endocrinologie/Diabétologie", 
          icon: Pill, 
          bgGradient: "from-emerald-500 to-teal-500", 
          available: true,
          title: "Endocrinologie",
          description: "Consultations pour troubles hormonaux et métaboliques. Prise en charge diabète et dysfonctions thyroïdiennes. Traitement obésité, ostéoporose et troubles croissance. Éducation thérapeutique et suivi diabétique. Bilans hormonaux complets disponibles... Voir plus"
        },
        { 
          name: "Gastroentérologie/Hépatologie", 
          icon: Thermometer, 
          bgGradient: "from-amber-500 to-orange-500", 
          available: true,
          title: "Gastroentérologie",
          description: "Consultations pour troubles digestifs et hépatiques. Traitement reflux, ulcères, maladies inflammatoires intestinales. Coloscopies de dépistage et endoscopies digestives. Prise en charge hépatites et pancréatites. Conseils nutritionnels personnalisés... Voir plus"
        },
        { 
          name: "Hématologie clinique", 
          icon: Syringe, 
          bgGradient: "from-red-600 to-pink-600", 
          available: true,
          title: "Hématologie",
          description: "Consultations pour maladies du sang et coagulation. Traitement anémies, leucémies et lymphomes. Prise en charge troubles de la coagulation. Transfusions sanguines et bilans hématologiques. Suivi spécialisé des pathologies sanguines... Voir plus"
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
          description: "Consultations pour pathologies complexes et multiples. Coordination des soins et diagnostic maladies rares. Prise en charge diabète, hypertension, maladies auto-immunes. Suivi global des patients adultes. Médecine préventive et dépistage... Voir plus"
        },
        { 
          name: "Néphrologie", 
          icon: Activity, 
          bgGradient: "from-blue-600 to-cyan-600", 
          available: true,
          title: "Néphrologie",
          description: "Consultations pour maladies rénales et troubles urinaires. Traitement insuffisance rénale et calculs rénaux. Dialyse et préparation à la transplantation. Suivi hypertension artérielle d'origine rénale. Bilans rénaux complets disponibles... Voir plus"
        },
        { 
          name: "Neurologie", 
          icon: Brain, 
          bgGradient: "from-purple-500 to-indigo-500", 
          available: true,
          title: "Neurologie",
          description: "Consultations pour troubles neurologiques et maux de tête. Prise en charge migraines, épilepsie, sclérose en plaques. Examens EEG, EMG et tests mémoire disponibles. Suivi des AVC et maladies neurodégénératives. Consultations urgentes possibles... Voir plus"
        },
        { 
          name: "Oncologie médicale", 
          icon: Scan, 
          bgGradient: "from-slate-600 to-gray-600", 
          available: true,
          title: "Oncologie",
          description: "Consultations spécialisées en cancérologie. Chimiothérapie, immunothérapie et thérapies ciblées. Accompagnement psychologique et soins de support. Coordination avec équipe pluridisciplinaire. Consultations d'annonce et suivi personnalisé... Voir plus"
        },
        { 
          name: "Pédiatrie", 
          icon: Baby, 
          bgGradient: "from-pink-500 to-rose-500", 
          available: true,
          title: "Pédiatrie",
          description: "Consultations enfants de 0 à 18 ans. Suivi croissance, vaccinations et bilans de santé. Traitement infections, fièvre et maladies infantiles. Conseils parentaux et accompagnement développement. Urgences pédiatriques 7j/7... Voir plus"
        },
        { 
          name: "Psychiatrie", 
          icon: Brain, 
          bgGradient: "from-violet-500 to-purple-500", 
          available: true,
          title: "Psychiatrie",
          description: "Consultations pour troubles mentaux et comportementaux. Traitement dépression, anxiété, troubles bipolaires. Prise en charge addictions et schizophrénie. Thérapies individuelles et familiales disponibles. Suivi médicamenteux personnalisé et confidentiel... Voir plus"
        },
        // Spécialités de biologie et diagnostic
        { 
          name: "Anatomopathologie", 
          icon: Microscope, 
          bgGradient: "from-gray-500 to-slate-600", 
          available: true,
          title: "Anatomopathologie",
          description: "Analyses microscopiques de tissus et biopsies. Diagnostic histologique des tumeurs et lésions. Examens cytologiques et immunohistochimie. Expertise anatomopathologique pour diagnostic précis. Résultats rapides et interprétation spécialisée... Voir plus"
        },
        { 
          name: "Biochimie médicale", 
          icon: FlaskConical, 
          bgGradient: "from-green-500 to-teal-500", 
          available: true,
          title: "Biochimie Médicale",
          description: "Analyses biologiques complètes et bilans sanguins. Dosages hormonaux, métaboliques et enzymatiques. Marqueurs tumoraux et tests spécialisés. Interprétation experte des résultats de laboratoire. Conseils personnalisés selon les analyses... Voir plus"
        },
        { 
          name: "Biologie clinique", 
          icon: Dna, 
          bgGradient: "from-cyan-500 to-blue-600", 
          available: true,
          title: "Biologie Clinique",
          description: "Examens biologiques de routine et spécialisés. Analyses sanguines, urinaires et microbiologiques. Tests génétiques et biologie moléculaire. Suivi thérapeutique et dépistage précoce. Laboratoire équipé des dernières technologies... Voir plus"
        },
        { 
          name: "Radiologie et imagerie médicale", 
          icon: Zap, 
          bgGradient: "from-yellow-500 to-orange-500", 
          available: true,
          title: "Radiologie",
          description: "Examens d'imagerie médicale de haute qualité. Échographies, scanners, IRM et radiographies. Mammographies et examens spécialisés disponibles. Équipements dernière génération pour diagnostic précis. Résultats rapides et interprétation experte... Voir plus"
        },
        // Spécialités transversales
        { 
          name: "Santé publique", 
          icon: Globe, 
          bgGradient: "from-emerald-600 to-green-600", 
          available: true,
          title: "Santé Publique",
          description: "Prévention et promotion de la santé collective. Épidémiologie et surveillance des maladies. Programmes de vaccination et dépistage. Éducation sanitaire et sensibilisation communautaire. Actions de santé publique et recherche épidémiologique... Voir plus"
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
        { 
          name: "Cardiology", 
          icon: Heart, 
          bgGradient: "from-red-500 to-pink-500", 
          available: true,
          description: "Cardiovascular diseases, heart conditions, and blood vessel disorders. Prevention and treatment of heart attacks, arrhythmias, and hypertension."
        },
        { 
          name: "Neurology", 
          icon: Brain, 
          bgGradient: "from-purple-500 to-indigo-500", 
          available: true,
          description: "Nervous system disorders, brain and spinal cord conditions. Treatment of migraines, epilepsy, strokes, and neurodegenerative diseases."
        },
        { 
          name: "Ophthalmology", 
          icon: Eye, 
          bgGradient: "from-blue-500 to-cyan-500", 
          available: true,
          description: "Eye care, vision problems, and ocular diseases. Cataract surgery, glaucoma treatment, and comprehensive eye examinations."
        },
        { 
          name: "Orthopedics", 
          icon: Bone, 
          bgGradient: "from-orange-500 to-red-500", 
          available: true,
          description: "Bone, joint, and musculoskeletal disorders. Fracture treatment, joint replacement, and sports injury rehabilitation."
        },
        { 
          name: "Pediatrics", 
          icon: Baby, 
          bgGradient: "from-pink-500 to-rose-500", 
          available: true,
          description: "Children's health from birth to adolescence. Vaccinations, growth monitoring, and treatment of childhood diseases."
        },
        { 
          name: "General Medicine", 
          icon: Stethoscope, 
          bgGradient: "from-emerald-500 to-teal-500", 
          available: true,
          description: "Primary healthcare, preventive medicine, and comprehensive health management for adults and families."
        },
        { 
          name: "Emergency", 
          icon: Activity, 
          bgGradient: "from-red-600 to-orange-600", 
          available: true,
          description: "24/7 emergency care, trauma treatment, and critical care services for urgent medical situations."
        },
        { 
          name: "Radiology", 
          icon: Zap, 
          bgGradient: "from-yellow-500 to-orange-500", 
          available: true,
          description: "Medical imaging services including X-rays, CT scans, MRI, and ultrasound for accurate diagnosis."
        },
        { 
          name: "Dermatology", 
          icon: Shield, 
          bgGradient: "from-amber-400 to-yellow-500", 
          available: true,
          description: "Skin, hair, and nail conditions. Treatment of acne, eczema, skin cancer screening, and cosmetic procedures."
        },
        { 
          name: "Gastroenterology", 
          icon: Thermometer, 
          bgGradient: "from-green-500 to-emerald-500", 
          available: true,
          description: "Digestive system disorders, liver diseases, and gastrointestinal conditions. Endoscopy and colonoscopy services."
        },
        { 
          name: "Psychiatry", 
          icon: Brain, 
          bgGradient: "from-violet-500 to-purple-600", 
          available: true,
          description: "Mental health disorders, depression, anxiety, and behavioral conditions. Therapy and psychiatric medication management."
        },
        { 
          name: "Gynecology", 
          icon: Heart, 
          bgGradient: "from-rose-400 to-pink-500", 
          available: true,
          description: "Women's reproductive health, pregnancy care, and gynecological conditions. Prenatal care and family planning."
        },
        { 
          name: "Endocrinology", 
          icon: Pill, 
          bgGradient: "from-teal-500 to-cyan-500", 
          available: true,
          description: "Hormonal disorders, diabetes management, and metabolic conditions. Thyroid diseases and hormone replacement therapy."
        },
        { 
          name: "Nephrology", 
          icon: Activity, 
          bgGradient: "from-blue-600 to-indigo-600", 
          available: true,
          description: "Kidney diseases, dialysis services, and renal disorders. Treatment of kidney stones and chronic kidney disease."
        },
        { 
          name: "Oncology", 
          icon: Scan, 
          bgGradient: "from-slate-500 to-gray-600", 
          available: true,
          description: "Cancer diagnosis and treatment. Chemotherapy, radiation therapy, and comprehensive cancer care services."
        },
        { 
          name: "Hematology", 
          icon: Syringe, 
          bgGradient: "from-red-400 to-rose-500", 
          available: true,
          description: "Blood disorders, anemia, and hematological conditions. Blood transfusions and coagulation disorder treatment."
        },
        { 
          name: "Pulmonology", 
          icon: Activity, 
          bgGradient: "from-sky-500 to-blue-500", 
          available: true,
          description: "Respiratory diseases, lung conditions, and breathing disorders. Asthma, COPD treatment, and pulmonary function tests."
        },
        { 
          name: "Rheumatology", 
          icon: Bone, 
          bgGradient: "from-orange-400 to-amber-500", 
          available: true,
          description: "Arthritis, joint pain, and autoimmune conditions. Treatment of rheumatoid arthritis, lupus, and fibromyalgia."
        }
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon
            return (
              <div key={index} className="group relative">
                <div className={`relative overflow-hidden rounded-2xl h-80 bg-gradient-to-br ${specialty.bgGradient} shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2`}>
                <IconComponent className="w-56 h-56 text-white/20 absolute -bottom-10 -left-10" />

                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                  
                  {/* Icon positioned at top right */}
                  <div className="absolute top-6 right-6 z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white border-opacity-30">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  {/* Content positioned at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="font-bold text-2xl text-white mb-3 leading-tight">
                      {specialty.name}
                    </h3>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed mb-4 line-clamp-3">
                      {specialty.description || (language === 'fr' 
                        ? 'Spécialité médicale disponible avec des professionnels qualifiés pour vos soins de santé.' 
                        : 'Medical specialty available with qualified professionals for your healthcare needs.')}
                    </p>
                    <div className="flex items-center text-white font-medium group-hover:text-yellow-300 transition-colors">
                      <span className="text-sm">{language === 'fr' ? 'Découvrir' : 'Discover'}</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-8 left-6 w-2 h-2 bg-white bg-opacity-60 rounded-full"></div>
                    <div className="absolute top-12 left-8 w-1 h-1 bg-white bg-opacity-40 rounded-full"></div>
                    <div className="absolute bottom-20 right-8 w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
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