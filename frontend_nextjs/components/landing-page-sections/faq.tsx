"use client"

import { HelpCircle, MessageCircle, Clock, Shield, Users, Heart, Star, Phone, Calendar } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQProps {
  language: 'fr' | 'en'
}

export default function FAQ({ language }: FAQProps) {

  const texts = {
    fr: {
      title: "Questions Fréquentes",
      subtitle: "Trouvez rapidement les réponses à vos questions sur KamerCare",
      faqs: [
        {
          question: "Comment prendre un rendez-vous sur KamerCare ?",
          answer: "Vous pouvez prendre rendez-vous en quelques clics : créez votre compte, recherchez un médecin par spécialité ou localisation, choisissez un créneau disponible et confirmez votre réservation. Vous recevrez une confirmation par email et SMS.",
          icon: Calendar
        },
        {
          question: "KamerCare est-il vraiment gratuit ?",
          answer: "Oui, KamerCare est 100% gratuit pour les patients. Aucun frais caché, aucun abonnement. Notre plateforme est financée par les professionnels de santé qui utilisent nos services pour gérer leurs consultations.",
          icon: Heart
        },
        {
          question: "Comment annuler ou modifier mon rendez-vous ?",
          answer: "Vous pouvez annuler ou modifier votre rendez-vous jusqu'à 2 heures avant l'heure prévue via votre espace patient. En cas d'urgence, contactez directement le cabinet médical.",
          icon: Clock
        },
        {
          question: "Mes données personnelles sont-elles sécurisées ?",
          answer: "Absolument. KamerCare respecte le RGPD et utilise un chiffrement de niveau bancaire. Vos données médicales sont stockées de manière sécurisée et ne sont jamais partagées sans votre consentement explicite.",
          icon: Shield
        },
        {
          question: "Puis-je consulter un médecin en vidéo ?",
          answer: "Oui, KamerCare propose des consultations en télémédecine avec des médecins certifiés. Vous pouvez choisir entre consultation physique ou vidéo lors de la prise de rendez-vous, selon la disponibilité du praticien.",
          icon: MessageCircle
        },
        {
          question: "Comment trouver un spécialiste près de chez moi ?",
          answer: "Utilisez notre moteur de recherche avancé : sélectionnez votre spécialité, votre ville ou code postal, et filtrez par disponibilité. La carte interactive vous montre tous les praticiens dans votre zone géographique.",
          icon: Users
        },
        {
          question: "Que faire si je n'arrive pas à me connecter ?",
          answer: "Vérifiez votre email et mot de passe. Si le problème persiste, utilisez la fonction 'Mot de passe oublié' ou contactez notre support technique disponible 24h/7j via le chat en ligne.",
          icon: HelpCircle
        },
        {
          question: "Les médecins sur KamerCare sont-ils certifiés ?",
          answer: "Tous nos praticiens sont des professionnels de santé diplômés et inscrits à l'Ordre des Médecins. Nous vérifions leurs qualifications et leur autorisation d'exercer avant leur inscription sur la plateforme.",
          icon: Star
        },
        {
          question: "Puis-je avoir un rappel de mon rendez-vous ?",
          answer: "Oui, vous recevez automatiquement des rappels par email 24h avant et par SMS 2h avant votre rendez-vous. Vous pouvez personnaliser ces notifications dans vos paramètres de compte.",
          icon: Phone
        },
        {
          question: "Comment contacter le support client ?",
          answer: "Notre équipe support est disponible 24h/7j via le chat en ligne, par email à support@kamercare.com ou par téléphone au +237 XXX XXX XXX. Nous nous engageons à répondre dans les 2 heures.",
          icon: MessageCircle
        }
      ]
    },
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Find quick answers to your questions about KamerCare",
      faqs: [
        {
          question: "How do I book an appointment on KamerCare?",
          answer: "You can book an appointment in just a few clicks: create your account, search for a doctor by specialty or location, choose an available time slot, and confirm your booking. You'll receive confirmation via email and SMS.",
          icon: Calendar
        },
        {
          question: "Is KamerCare really free?",
          answer: "Yes, KamerCare is 100% free for patients. No hidden fees, no subscription. Our platform is funded by healthcare professionals who use our services to manage their consultations.",
          icon: Heart
        },
        {
          question: "How can I cancel or modify my appointment?",
          answer: "You can cancel or modify your appointment up to 2 hours before the scheduled time through your patient portal. In case of emergency, contact the medical office directly.",
          icon: Clock
        },
        {
          question: "Is my personal data secure?",
          answer: "Absolutely. KamerCare complies with GDPR and uses bank-level encryption. Your medical data is stored securely and never shared without your explicit consent.",
          icon: Shield
        },
        {
          question: "Can I consult a doctor via video?",
          answer: "Yes, KamerCare offers telemedicine consultations with certified doctors. You can choose between in-person or video consultation when booking, depending on the practitioner's availability.",
          icon: MessageCircle
        },
        {
          question: "How do I find a specialist near me?",
          answer: "Use our advanced search engine: select your specialty, city or postal code, and filter by availability. The interactive map shows you all practitioners in your geographic area.",
          icon: Users
        },
        {
          question: "What if I can't log in?",
          answer: "Check your email and password. If the problem persists, use the 'Forgot password' function or contact our technical support available 24/7 via online chat.",
          icon: HelpCircle
        },
        {
          question: "Are doctors on KamerCare certified?",
          answer: "All our practitioners are qualified healthcare professionals registered with the Medical Board. We verify their qualifications and authorization to practice before their registration on the platform.",
          icon: Star
        },
        {
          question: "Can I get appointment reminders?",
          answer: "Yes, you automatically receive email reminders 24 hours before and SMS reminders 2 hours before your appointment. You can customize these notifications in your account settings.",
          icon: Phone
        },
        {
          question: "How do I contact customer support?",
          answer: "Our support team is available 24/7 via online chat, email at support@kamercare.com, or phone at +237 XXX XXX XXX. We commit to responding within 2 hours.",
          icon: MessageCircle
        }
      ]
    }
  }

  const t = texts[language]

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl mb-6 shadow-xl">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-6">
            {t.title}
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="multiple" className="space-y-4">
          {t.faqs.map((faq, index) => {
            const Icon = faq.icon
            
            return (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>div:first-child]:bg-gradient-to-br [&[data-state=open]>div>div:first-child]:from-blue-500 [&[data-state=open]>div>div:first-child]:to-emerald-500 [&[data-state=open]>div>div:first-child]:shadow-lg [&[data-state=open]>div>div:first-child]:scale-110 [&[data-state=open]>div>h3]:text-blue-600 dark:[&[data-state=open]>div>h3]:text-blue-400">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon with gradient background */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 bg-slate-100 dark:bg-slate-700 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-emerald-500">
                      <Icon className="w-6 h-6 transition-colors duration-300 text-slate-600 dark:text-slate-300 group-hover:text-white [&[data-state=open]]:text-white" />
                    </div>
                    
                    {/* Question */}
                    <h3 className="text-lg font-semibold transition-colors duration-300 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-left">
                      {faq.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="ml-16 pl-4 border-l-2 border-gradient-to-b from-blue-500 to-emerald-500">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {language === 'fr' ? 'Vous ne trouvez pas votre réponse ?' : "Can't find your answer?"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {language === 'fr' 
                ? 'Notre équipe support est là pour vous aider 24h/7j' 
                : 'Our support team is here to help you 24/7'
              }
            </p>
            <button className="group bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {language === 'fr' ? 'Contacter le support' : 'Contact Support'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}