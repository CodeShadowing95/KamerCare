"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  Award,
  Heart,
  Star,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorFooterProps {
  language: string
}

export default function DoctorFooter({ language }: DoctorFooterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    const section = document.getElementById('footer-section')
    if (section) {
      observer.observe(section)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerSections = [
    {
      title: "Fonctionnalités",
      links: [
        { name: "Gestion des RDV", href: "#rdv" },
        { name: "Dossiers patients", href: "#dossiers" },
        { name: "Prescriptions", href: "#prescriptions" },
        { name: "Rapports médicaux", href: "#rapports" },
        { name: "Téléconsultation", href: "#teleconsultation" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Formation", href: "#formation" },
        { name: "Support technique", href: "#support" },
        { name: "FAQ Médecins", href: "#faq" },
        { name: "Webinaires", href: "#webinaires" }
      ]
    },
    {
      title: "Légal",
      links: [
        { name: "Conditions d'utilisation", href: "#terms" },
        { name: "Politique de confidentialité", href: "#privacy" },
        { name: "Conformité RGPD", href: "#rgpd" },
        { name: "Charte éthique", href: "#ethics" },
        { name: "Certifications", href: "#certifications" }
      ]
    }
  ]

  const socialLinks = [
    { icon: Facebook, href: "#facebook", name: "Facebook" },
    { icon: Twitter, href: "#twitter", name: "Twitter" },
    { icon: Linkedin, href: "#linkedin", name: "LinkedIn" },
    { icon: Instagram, href: "#instagram", name: "Instagram" }
  ]

  const stats = [
    { value: "2,500+", label: "Médecins Actifs", icon: Stethoscope },
    { value: "150+", label: "Hôpitaux Connectés", icon: Heart },
    { value: "98%", label: "Satisfaction", icon: Star },
    { value: "24/7", label: "Support", icon: Clock }
  ]

  return (
    <footer id="footer-section" className="px-4 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-600/8 to-cyan-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-amber-600/6 to-orange-600/4 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating Medical Icons */}
        <div className="absolute top-20 right-20 animate-float-gentle">
          <div className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
            <Heart className="w-6 h-6 text-red-400/60" />
          </div>
        </div>
        
        <div className="absolute bottom-32 left-16 animate-float-gentle delay-1500">
          <div className="w-10 h-10 bg-white/5 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10">
            <Shield className="w-5 h-5 text-emerald-400/60" />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4 animate-float-gentle delay-3000">
          <div className="w-8 h-8 bg-white/5 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/10">
            <Award className="w-4 h-4 text-amber-400/60" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Stats Section */}
        <div className={`py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center transition-all duration-700 delay-${index * 150} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className={`py-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 flex items-center justify-center p-2">
                  <img src="/KamerCare-logo.png" alt="KamerCare" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    KamerCare
                  </div>
                  <div className="text-slate-400 text-sm font-medium">
                    Espace Professionnel
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                Plateforme professionnelle dédiée aux praticiens de santé du Cameroun. 
                Modernisez votre pratique médicale avec nos outils innovants et sécurisés.
              </p>
              
              {/* Certifications */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Certifié RGPD
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                  <Award className="w-3 h-3 mr-1" />
                  ISO 27001
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Ministère Santé
                </Badge>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link key={index} href={social.href}>
                    <div className="w-10 h-10 bg-white/5 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300 group">
                      <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index} className="">
                <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-slate-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                        <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className={`py-12 border-t border-white/10 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium">Support Technique</div>
                <div className="text-slate-400 text-sm">+237 222 23 40 19</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors duration-300">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-medium">Email Professionnel</div>
                <div className="text-slate-400 text-sm">medecins@minsante.cm</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors duration-300">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">Disponibilité</div>
                <div className="text-slate-400 text-sm">Support 24h/7j</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`py-8 border-t border-white/10 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                &copy; 2025 KamerCare Services - Ministère de la Santé Publique.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Espace Professionnel • Tous droits réservés • Version 2.1.0
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>Système opérationnel</span>
              </div>
              
              <div className="text-slate-500 text-xs">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 border-0"
          size="icon"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </Button>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 12s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </footer>
  )
}