"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Star, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Clock, 
  Stethoscope,
  BarChart3,
  Award,
  Timer
} from 'lucide-react'
import { Doctor } from '@/types/doctor'

interface SearchStatsProps {
  doctors: Doctor[]
  searchQuery: string
  filters: any
}

export default function SearchStats({ doctors, searchQuery, filters }: SearchStatsProps) {
  const stats = useMemo(() => {
    if (!doctors.length) return null

    // Statistiques générales
    const totalDoctors = doctors.length
    const averageRating = doctors.reduce((sum, doc) => sum + (doc.rating || 0), 0) / totalDoctors
    const averagePrice = doctors.reduce((sum, doc) => sum + (doc.consultationFee || 0), 0) / totalDoctors
    
    // Répartition par spécialité
    const specialtyCount = doctors.reduce((acc, doc) => {
      const specialty = doc.specialty || 'Non spécifié'
      acc[specialty] = (acc[specialty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top 3 spécialités
    const topSpecialties = Object.entries(specialtyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    // Répartition par ville
    const cityCount = doctors.reduce((acc, doc) => {
      const city = doc.location?.split(',')[0] || doc.city || 'Non spécifié'
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Répartition par gamme de prix
    const priceRanges = {
      'Économique (< 20k)': doctors.filter(d => (d.consultationFee || 0) < 20000).length,
      'Standard (20k-40k)': doctors.filter(d => (d.consultationFee || 0) >= 20000 && (d.consultationFee || 0) < 40000).length,
      'Premium (40k+)': doctors.filter(d => (d.consultationFee || 0) >= 40000).length,
    }

    // Disponibilité
    const availableToday = doctors.filter(d => d.availableSlots && d.availableSlots.length > 0).length
    const availabilityRate = (availableToday / totalDoctors) * 100

    // Expérience moyenne
    const averageExperience = doctors.reduce((sum, doc) => sum + (doc.experience || 0), 0) / totalDoctors

    return {
      totalDoctors,
      averageRating,
      averagePrice,
      topSpecialties,
      cityCount,
      priceRanges,
      availableToday,
      availabilityRate,
      averageExperience
    }
  }, [doctors])

  if (!stats) return null

  return (
    <Card className="w-full shadow-sm border-0 bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="pb-4 px-5 pt-5">
        <CardTitle className="text-lg font-semibold flex items-center gap-2.5 text-slate-800">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
            <BarChart3 className="h-4 w-4" />
          </div>
          <span className="tracking-tight">Statistiques de recherche</span>
          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium px-2 py-0.5 text-xs">
            {stats.totalDoctors} résultat{stats.totalDoctors > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <Separator className="mt-3 bg-slate-200/60" />
      </CardHeader>
      
      <CardContent className="px-5 pb-5">
        {/* Statistiques principales - Version compacte */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {stats.totalDoctors}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Médecin{stats.totalDoctors > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
              <Star className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800 flex items-center gap-1">
                {stats.averageRating.toFixed(1)}
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Note moyenne
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {Math.round(stats.averagePrice / 1000)}k
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Prix moyen
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {stats.availableToday}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Disponible{stats.availableToday > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques détaillées compactes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top spécialités */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Stethoscope className="h-4 w-4 text-emerald-600" />
              Top spécialités
            </div>
            <div className="space-y-2">
              {stats.topSpecialties.map(([specialty, count], index) => (
                <div key={specialty} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-5 h-5 p-0 flex items-center justify-center text-xs font-bold border-emerald-200 text-emerald-700">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium text-slate-700 truncate">{specialty}</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Répartition des prix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <DollarSign className="h-4 w-4 text-green-600" />
              Gammes de prix
            </div>
            <div className="space-y-2">
              {Object.entries(stats.priceRanges).map(([range, count]) => {
                const percentage = (count / stats.totalDoctors) * 100
                const colorClass = range.includes('Économique') ? 'bg-green-500' : 
                                 range.includes('Standard') ? 'bg-blue-500' : 'bg-purple-500'
                return (
                  <div key={range} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{range}</span>
                      <span className="text-xs text-slate-500">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Métriques supplémentaires */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Award className="h-4 w-4 text-orange-600" />
              Métriques clés
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <Timer className="h-3.5 w-3.5 text-orange-600" />
                  <span className="text-sm font-medium text-slate-700">Expérience moy.</span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                  {stats.averageExperience.toFixed(1)} ans
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Disponibilité</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5">
                  {stats.availabilityRate.toFixed(0)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Villes couvertes</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                  {Object.keys(stats.cityCount).length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}