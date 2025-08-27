"use client"

import Link from "next/link"
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  Users, 
  Clock, 
  Award,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FooterProps {
  language: 'fr' | 'en'
}

export default function Footer({ language }: FooterProps) {
  const texts = {
    fr: {
      brand: {
        title: "République du Cameroun",
        subtitle: "Ministère de la Santé Publique",
        description: "Plateforme officielle de prise de rendez-vous dans les hôpitaux publics du Cameroun. Votre santé, notre priorité."
      },
      services: {
        title: "Services",
        links: [
          { name: "Prise de RDV", href: "/booking" },
          { name: "Urgences 24/7", href: "/emergency" },
          { name: "Téléconsultation", href: "/teleconsultation" },
          { name: "Pharmacies", href: "/pharmacies" },
          { name: "Dossier médical", href: "/medical-records" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Centre d'aide", href: "/help" },
          { name: "FAQ", href: "/faq" },
          { name: "Contact", href: "/contact" },
          { name: "Signaler un problème", href: "/report" },
          { name: "Accessibilité", href: "/accessibility" }
        ]
      },
      legal: {
        title: "Légal",
        links: [
          { name: "Conditions d'utilisation", href: "/terms" },
          { name: "Politique de confidentialité", href: "/privacy" },
          { name: "Cookies", href: "/cookies" },
          { name: "Mentions légales", href: "/legal" }
        ]
      },
      contact: {
        title: "Contact",
        phone: "+237 222 23 40 18",
        email: "contact@minsante.cm",
        address: "Yaoundé, Cameroun",
        emergency: "Urgences: 8200"
      },
      newsletter: {
        title: "Restez informé",
        description: "Recevez les dernières actualités santé et les mises à jour de notre plateforme.",
        placeholder: "Votre adresse email",
        button: "S'abonner"
      },
      social: {
        title: "Suivez-nous",
        description: "Restez connecté avec nous sur les réseaux sociaux"
      },
      stats: [
        { number: "50+", label: "Hôpitaux" },
        { number: "500K+", label: "Patients" },
        { number: "1000+", label: "Médecins" },
        { number: "24/7", label: "Disponible" }
      ],
      copyright: "© 2025 KamerCare Services - Ministère de la Santé Publique. Tous droits réservés.",
      madeWith: "Fait avec",
      forCameroon: "pour le Cameroun"
    },
    en: {
      brand: {
        title: "Republic of Cameroon",
        subtitle: "Ministry of Public Health",
        description: "Official platform for booking appointments in Cameroon's public hospitals. Your health, our priority."
      },
      services: {
        title: "Services",
        links: [
          { name: "Book Appointment", href: "/booking" },
          { name: "24/7 Emergency", href: "/emergency" },
          { name: "Teleconsultation", href: "/teleconsultation" },
          { name: "Pharmacies", href: "/pharmacies" },
          { name: "Medical Records", href: "/medical-records" }
        ]
      },
      support: {
        title: "Support",
        links: [
          { name: "Help Center", href: "/help" },
          { name: "FAQ", href: "/faq" },
          { name: "Contact", href: "/contact" },
          { name: "Report Issue", href: "/report" },
          { name: "Accessibility", href: "/accessibility" }
        ]
      },
      legal: {
        title: "Legal",
        links: [
          { name: "Terms of Service", href: "/terms" },
          { name: "Privacy Policy", href: "/privacy" },
          { name: "Cookies", href: "/cookies" },
          { name: "Legal Notice", href: "/legal" }
        ]
      },
      contact: {
        title: "Contact",
        phone: "+237 222 23 40 18",
        email: "contact@minsante.cm",
        address: "Yaoundé, Cameroon",
        emergency: "Emergency: 8200"
      },
      newsletter: {
        title: "Stay Informed",
        description: "Get the latest health news and platform updates.",
        placeholder: "Your email address",
        button: "Subscribe"
      },
      social: {
        title: "Follow Us",
        description: "Stay connected with us on social media"
      },
      stats: [
        { number: "50+", label: "Hospitals" },
        { number: "500K+", label: "Patients" },
        { number: "1000+", label: "Doctors" },
        { number: "24/7", label: "Available" }
      ],
      copyright: "© 2025 KamerCare Services - Ministry of Public Health. All rights reserved.",
      madeWith: "Made with",
      forCameroon: "for Cameroon"
    }
  }

  const t = texts[language]

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Youtube, href: "#", name: "YouTube" }
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-32 relative z-10">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img 
                    src="/KamerCare-logo-footer.png" 
                    alt="KamerCare Logo" 
                    className="w-40 h-40 object-contain transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                {t.brand.description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {t.stats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="text-xl font-bold text-emerald-400">{stat.number}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Emergency contact */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-300">{t.contact.emergency}</span>
                </div>
                <p className="text-xs text-slate-400">Numéro d'urgence national gratuit</p>
              </div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Services */}
                <div>
                  <h3 className="font-bold text-white mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
                    {t.services.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.services.links.map((link, index) => (
                      <li key={index}>
                        <Link 
                          href={link.href} 
                          className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center group"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-bold text-white mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-400" />
                    {t.support.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.support.links.map((link, index) => (
                      <li key={index}>
                        <Link 
                          href={link.href} 
                          className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center group"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-bold text-white mb-6 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-400" />
                    {t.legal.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.legal.links.map((link, index) => (
                      <li key={index}>
                        <Link 
                          href={link.href} 
                          className="text-slate-400 hover:text-purple-400 transition-colors duration-200 text-sm flex items-center group"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter and contact */}
            <div className="lg:col-span-3">
              {/* Newsletter */}
              <div className="mb-8">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-yellow-400" />
                  {t.newsletter.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {t.newsletter.description}
                </p>
                <div className="flex flex-col space-y-3">
                  <Input 
                    type="email" 
                    placeholder={t.newsletter.placeholder}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-emerald-400"
                  />
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {t.newsletter.button}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Contact info */}
              <div className="mb-8">
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-400" />
                  {t.contact.title}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-slate-400 hover:text-green-400 transition-colors">
                    <Phone className="w-4 h-4 mr-3 text-green-400" />
                    <a href={`tel:${t.contact.phone}`}>{t.contact.phone}</a>
                  </div>
                  <div className="flex items-center text-slate-400 hover:text-blue-400 transition-colors">
                    <Mail className="w-4 h-4 mr-3 text-blue-400" />
                    <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <MapPin className="w-4 h-4 mr-3 text-red-400" />
                    <span>{t.contact.address}</span>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-pink-400" />
                  {t.social.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {t.social.description}
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon
                    return (
                      <Link
                        key={index}
                        href={social.href}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                        aria-label={social.name}
                      >
                        <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-slate-400 text-center md:text-left">
              {t.copyright}
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>{t.madeWith}</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{t.forCameroon}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}