"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Shield, ArrowLeft, Heart, Activity, Zap, Star, Lock, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function DoctorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/doctor";
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-2xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}px`,
            top: `${mousePosition.y * 0.01}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-emerald-200/25 to-cyan-200/15 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-200/15 rounded-full blur-xl animate-pulse delay-2000" />
        
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-16 left-16 w-5 h-5 text-red-400/40 animate-bounce" style={{ animationDelay: '0s' }} />
          <Activity className="absolute top-32 right-24 w-4 h-4 text-green-500/50 animate-bounce" style={{ animationDelay: '1s' }} />
          <Zap className="absolute bottom-24 left-32 w-5 h-5 text-yellow-500/45 animate-bounce" style={{ animationDelay: '2s' }} />
          <Star className="absolute top-48 left-1/2 w-4 h-4 text-blue-500/40 animate-bounce" style={{ animationDelay: '3s' }} />
          <Lock className="absolute bottom-16 right-16 w-4 h-4 text-purple-500/45 animate-bounce" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-20 h-20 border border-blue-300/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute bottom-8 right-8 w-16 h-16 border border-purple-300/25 rotate-12 animate-spin" style={{ animationDuration: '15s' }} />
          <div className="absolute top-1/2 left-8 w-12 h-12 border border-indigo-300/35 -rotate-45 animate-spin" style={{ animationDuration: '25s' }} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Welcome Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
          <div className={`max-w-lg w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} relative`}>
            {/* Bouton Retour */}
            <div className="text-center pt-3 sm:pt-4 absolute top-0 left-0">
              <div className="relative inline-block group">
                <Link
                  href="/doctor"
                  className="relative inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/40 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/60 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">Retour</span>
                </Link>
              </div>
            </div>

            <div className="text-center space-y-4 sm:space-y-6">
              <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 group">
                <div className="absolute inset-0 blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="relative p-2 sm:p-3 transform group-hover:scale-110 transition-transform duration-300">
                  <img src="/KamerCare-logo.png" alt="KamerCare" className="w-full h-full object-contain" />
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                  Bienvenue sur KamerCare
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed px-4 sm:px-0">
                  Votre plateforme médicale de confiance pour une prise en charge optimale de vos patients.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-0">
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-200/50">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Sécurité médicale certifiée</span>
                </div>
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-emerald-200/50">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Suivi patient personnalisé</span>
                </div>
                <div className="flex items-center space-x-3 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/50">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">Outils de diagnostic avancés</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-gray-400 text-xs text-center px-4">
                  © 2024 KamerCare. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className={`w-full max-w-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-gray-200/50 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
            
              <CardHeader className="text-center space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                    Connexion Médecin
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm sm:text-base">
                    Accédez à votre espace professionnel
                  </CardDescription>
                </div>
                
                {/* <div className="flex justify-center items-center gap-1 sm:gap-2 overflow-x-auto py-2 px-2 sm:px-4">
                  <div className="flex-none inline-flex items-center space-x-1 px-1.5 sm:px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border border-emerald-200">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span className="text-xs text-emerald-700 whitespace-nowrap">Accès sécurisé</span>
                  </div>
                  <div className="flex-none inline-flex items-center space-x-1 px-1.5 sm:px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-700 whitespace-nowrap">Compte professionnel</span>
                  </div>
                </div> */}
              </CardHeader>
            
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium text-xs sm:text-sm flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Email professionnel</span>
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        placeholder="docteur@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 sm:h-11 bg-white/70 backdrop-blur-xl border-gray-200 focus:border-blue-400 focus:bg-white/90 text-gray-800 placeholder:text-gray-400 rounded-lg transition-all duration-300 group-hover:bg-white/80 text-sm sm:text-base"
                        required
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium text-xs sm:text-sm flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      <span>Mot de passe</span>
                    </Label>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 sm:h-11 bg-white/70 backdrop-blur-xl border-gray-200 focus:border-purple-400 focus:bg-white/90 text-gray-800 placeholder:text-gray-400 rounded-lg pr-10 transition-all duration-300 group-hover:bg-white/80 text-sm sm:text-base"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-md transition-all duration-300 h-6 w-6 sm:h-7 sm:w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
                      </Button>
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 group">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 data-[state=checked]:border-blue-400 transition-all duration-300"
                      />
                      <Label htmlFor="remember" className="text-gray-600 text-xs sm:text-sm cursor-pointer group-hover:text-gray-800 transition-colors duration-300">
                        Se souvenir
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm underline decoration-blue-500/50 hover:decoration-blue-600 transition-all duration-300">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                    <Button
                      type="submit"
                      className="relative w-full h-10 sm:h-11 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg hover:shadow-xl text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {isLoading ? (
                        <div className="flex items-center space-x-2 relative z-10">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Connexion...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 relative z-10">
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Se connecter</span>
                        </div>
                      )}
                    </Button>
                  </div>
              </form>
              
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="bg-white/80 backdrop-blur-xl px-3 sm:px-4 py-1 rounded-full text-gray-500 border border-gray-200">Nouveau ?</span>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-lg blur opacity-15 group-hover:opacity-30 transition-opacity duration-300" />
                  <Link href="/doctor/signup">
                    <Button
                      variant="outline"
                      className="relative w-full h-9 sm:h-10 border-gray-200 text-gray-700 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 bg-white/50 backdrop-blur-xl rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Créer un compte</span>
                      </div>
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 sm:mb-3">Vous êtes un patient ?</p>
                  <div className="relative inline-block group">
                    <Link href="/">
                      <Button variant="ghost" size="sm" className="relative text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 text-xs sm:text-sm">
                        Espace patient
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
