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
  Globe,
  MoveRight
} from "lucide-react"
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon
            return (
              <div key={index} className="group relative">
                <div className={`relative overflow-hidden rounded-xl h-48 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700`}>
                <IconComponent className="w-44 h-44 text-gray-100 dark:text-slate-700 absolute -bottom-6 -right-6" />

                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-gray-100/30 dark:bg-slate-700/30 group-hover:bg-gray-100/20 dark:group-hover:bg-slate-700/20 transition-all duration-300"></div>
                  
                  {/* Icon positioned at top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${specialty.bgGradient} backdrop-blur-sm flex items-center justify-center border border-white/20 dark:border-white/10 shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Content positioned at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <h3 className="font-semibold text-lg text-gray-700 dark:text-slate-200 mb-2 leading-tight">
                      {specialty.name}
                    </h3>
                    <p className="text-gray-700 dark:text-slate-300 text-opacity-80 dark:text-opacity-90 text-xs leading-relaxed mb-2 line-clamp-2">
                      {specialty.description || (language === 'fr' 
                        ? 'Spécialité médicale disponible avec des professionnels qualifiés.' 
                        : 'Medical specialty available with qualified professionals.')}
                    </p>
                    <div className="flex items-center text-gray-700 dark:text-slate-300 font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      <span className="text-xs">{language === 'fr' ? 'Découvrir' : 'Discover'}</span>
                      <MoveRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-slate-400/50 dark:bg-slate-400/50 rounded-full"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-slate-400/30 dark:bg-slate-400/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Additional info section - Design compact */}
        <div className="relative">
          
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50 max-w-4xl mx-auto">
            {/* Fond décoratif avec gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl transform rotate-1 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-50 via-purple-50 to-emerald-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 rounded-2xl transform -rotate-1 -z-10"></div>
            
            {/* Titre de la section */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                {language === 'fr' ? 'Pourquoi choisir KamerCare ?' : 'Why choose KamerCare?'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {language === 'fr' ? 'Des chiffres qui parlent de notre excellence' : 'Numbers that speak of our excellence'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Statistique 1 - Médecins */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl transform rotate-6 group-hover:rotate-4 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 text-center">{stats.doctors}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">{stats.doctorsDesc}</p>
                </div>
              </div>
              
              {/* Statistique 2 - Disponibilité */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl transform -rotate-6 group-hover:-rotate-3 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 text-center">{stats.availability}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">{stats.availabilityDesc}</p>
                </div>
              </div>
              
              {/* Statistique 3 - Certification */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl transform rotate-6 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1 text-center">{stats.certified}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">{stats.certifiedDesc}</p>
                </div>
              </div>
            </div>
            
            {/* Bouton d'action compact */}
            <div className="text-center mt-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl blur-md opacity-25 animate-pulse"></div>
                <Button size="default" className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20">
                  <Search className="w-5 h-5 mr-2" />
                  <span className="font-medium">{searchButton}</span>
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}