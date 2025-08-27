"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Sparkles,
  Star,
  Zap,
  Heart,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DoctorCTAProps {
  language: string
  t: {
    getStarted: string
    loginDoctor: string
  }
}

export default function DoctorCTA({ language, t }: DoctorCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('cta-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const testimonials = [
    { name: "Dr. Kamga", text: "Interface intuitive", rating: 5 },
    { name: "Dr. Mballa", text: "Gain de temps énorme", rating: 5 },
    { name: "Dr. Fouda", text: "Support excellent", rating: 5 }
  ]

  return (
    <section 
      id="cta-section" 
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Interactive Mouse Follower */}
        <div 
          className="absolute w-32 h-32 bg-gradient-to-br from-white/5 to-white/2 rounded-full blur-xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float-gentle">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
            <Star className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        
        <div className="absolute bottom-32 left-16 animate-float-gentle delay-1500">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
            <Heart className="w-6 h-6 text-red-400" />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/4 animate-float-gentle delay-3000">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
            <Zap className="w-7 h-7 text-yellow-400" />
          </div>
        </div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-16 left-1/4 w-24 h-24 border border-white/10 rounded-lg rotate-45 animate-spin-slow" />
        <div className="absolute bottom-20 right-1/3 w-16 h-16 border border-white/10 rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl text-white text-sm font-medium border border-white/20 shadow-2xl rounded-full mb-8 hover:bg-white/15 transition-all duration-300">
              <Shield className="w-4 h-4 mr-2 text-emerald-400" />
              <span>Certifié par le Ministère de la Santé du Cameroun</span>
              <CheckCircle className="w-4 h-4 ml-2 text-emerald-400" />
            </Badge>
          </div>

          {/* Main Heading */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Rejoignez la révolution
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                digitale de la santé
              </span>
            </h2>
          </div>

          {/* Subtitle with Stats */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
              Plus de <span className="font-bold text-white">2,500 médecins</span> font déjà confiance à notre plateforme pour améliorer leurs soins
            </p>
            
            {/* Mini Testimonials */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-white/90 text-sm font-medium">{testimonial.name}</span>
                    <span className="text-white/70 text-xs">• {testimonial.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/doctor/signup">
                <Button
                  size="lg"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden"
                >
                  {/* Button Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 group-hover:animate-shimmer" />
                  
                  <div className="relative flex items-center">
                    <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg">{t.getStarted}</span>
                    <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/doctor/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="group px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <span className="text-lg">{t.loginDoctor}</span>
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
            </div>
            
            {/* Security Note */}
            <div className="mt-8 flex items-center justify-center space-x-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Données sécurisées • Conformité RGPD • Support 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 10s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
            opacity: 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  )
}