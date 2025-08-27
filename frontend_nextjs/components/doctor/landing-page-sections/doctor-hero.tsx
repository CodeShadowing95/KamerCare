"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  Shield,
  Clock,
  Award,
  ChevronRight,
  UserCheck,
  Activity,
  Clipboard,
  Stethoscope,
  Heart,
  Brain,
  Zap,
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface DoctorHeroProps {
  language: string
  t: {
    title: string
    subtitle: string
    loginDoctor: string
    registerDoctor: string
  }
}

export default function DoctorHero({ language, t }: DoctorHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-800/90 overflow-hidden">
      {/* Sophisticated Background with Subtle Animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.06),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(139,92,246,0.04),transparent_50%)]" />
        
        {/* Interactive Gradient Orb */}
        <div 
          className="absolute w-[300px] h-[300px] bg-gradient-to-r from-blue-500/8 via-emerald-500/6 to-purple-500/4 rounded-full blur-3xl transition-all duration-[2000ms] ease-out"
          style={{
            left: `${mousePosition.x * 0.01}px`,
            top: `${mousePosition.y * 0.01}px`,
          }}
        />
        
        {/* Elegant Floating Orbs */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/12 to-emerald-400/8 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-16 right-16 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/6 rounded-full blur-2xl animate-float-slow delay-1000" />
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-br from-emerald-400/8 to-cyan-400/6 rounded-full blur-xl animate-float-slow delay-2000" />
        
        {/* Refined Medical Icons with Subtle Animations */}
        <div className="absolute top-12 left-8 animate-float-gentle">
          <div className="w-8 h-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/40 dark:border-slate-700/40 hover:scale-110 transition-all duration-500">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="absolute top-24 right-12 animate-float-gentle delay-500">
          <div className="w-10 h-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/30 dark:border-slate-700/30 hover:scale-110 transition-all duration-500">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        
        <div className="absolute bottom-24 left-12 animate-float-gentle delay-1000">
          <div className="w-7 h-7 bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/50 dark:border-slate-700/50 hover:scale-110 transition-all duration-500">
            <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
        
        <div className="absolute top-36 right-1/3 animate-float-gentle delay-1500">
          <div className="w-6 h-6 bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg border border-white/35 dark:border-slate-700/35 hover:scale-110 transition-all duration-500">
            <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        {/* Minimalist Geometric Accents */}
        <div className="absolute top-40 right-16 w-2 h-2 bg-blue-500/30 rounded-full animate-pulse" />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-emerald-500/40 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/2 right-12 w-1 h-1 bg-purple-500/50 rounded-full animate-pulse delay-1400" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col justify-center min-h-[70vh] py-8">
          {/* Elegant Trust Badge */}
          <div className={`text-center mb-6 transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-full hover:scale-105 hover:shadow-xl transition-all duration-500 group">
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mr-2">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                Plateforme Certifiée Ministère de la Santé
              </span>
              <Sparkles className="w-3 h-3 ml-2 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
            </Badge>
          </div>

          {/* Two-column layout with Enhanced Spacing */}
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left column - Content */}
              <div className={`space-y-6 transition-all duration-1200 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-700 dark:from-white dark:via-blue-200 dark:to-emerald-300 bg-clip-text text-transparent">
                      {t.title}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
                    {t.subtitle}
                  </p>
                </div>

                {/* Refined Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/doctor/login" className="group">
                    <Button size="default" className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-400 px-6 py-3 text-base font-medium rounded-xl border-0">
                      <UserCheck className="w-4 h-4 mr-2" />
                      {t.loginDoctor}
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link href="/doctor/signup" className="group">
                    <Button
                      size="default"
                      variant="outline"
                      className="relative border-2 border-slate-300 dark:border-slate-600 text-slate-700 hover:text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-400 px-6 py-3 text-base font-medium rounded-xl"
                    >
                      <Clipboard className="w-4 h-4 mr-2" />
                      {t.registerDoctor}
                      <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column - Elegant Stats Card */}
              <div className={`space-y-4 transition-all duration-1200 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-700 overflow-hidden group">
                  <CardContent className="p-6">
                    {/* Card Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
                        Notre Impact
                      </h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto" />
                    </div>
                    
                    {/* Refined Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center group/stat p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-500">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover/stat:scale-105 transition-transform duration-400 mb-2">2,500+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">Médecins Actifs</div>
                      </div>
                      
                      <div className="text-center group/stat p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-500">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 group-hover/stat:scale-105 transition-transform duration-400 mb-2">150+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">Hôpitaux Connectés</div>
                      </div>
                      
                      <div className="text-center group/stat p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-500">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover/stat:scale-105 transition-transform duration-400 mb-2">98%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">Satisfaction</div>
                      </div>
                      
                      <div className="text-center group/stat p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all duration-500">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 group-hover/stat:scale-105 transition-transform duration-400 mb-2">24/7</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium tracking-wide">Support</div>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">Mis à jour en temps réel</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
          }
        }
        .animate-float-gentle {
          animation: float-gentle 8s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  )
}