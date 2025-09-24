"use client"

import ContentHeader from '@/components/admin/content-header'
import React, { useState, useEffect } from 'react'
import { Search, Plus, Filter, SortAsc, Eye, Edit, Trash2, MapPin, Phone, Mail, Building2, MoreHorizontal, Activity, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useHospitals } from '@/hooks/use-hospitals'
import { useRouter } from 'next/navigation'

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

const ManageHospitalsPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all, public, private
  const [sortBy, setSortBy] = useState('nom')
  const [sortOrder, setSortOrder] = useState('asc')

  const { hospitals, loading, error, searchHospitals } = useHospitals()

  // Mettre à jour les données quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchHospitals(searchTerm)
    }, 300) // Debounce de 300ms pour la recherche

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchHospitals])

  // Filtrage des hôpitaux
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.adresse.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = typeFilter === 'all' ||
      (typeFilter === 'public' && hospital.type === 'public') ||
      (typeFilter === 'private' && hospital.type === 'private')

    return matchesSearch && matchesFilter
  })

  // Tri des hôpitaux
  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a]
    const bValue = b[sortBy as keyof typeof b]

    if (aValue && bValue) {
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    }
    // Si l'une des valeurs est undefined, on la place à la fin
    if (!aValue) return sortOrder === 'asc' ? 1 : -1
    if (!bValue) return sortOrder === 'asc' ? -1 : 1

    return 0
  })

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleDelete = (hospitalId: number) => {
    console.log('Supprimer hôpital:', hospitalId)
  }

  const handleEdit = (hospitalId: number) => {
    console.log('Modifier hôpital:', hospitalId)
  }

  const handleView = (hospitalId: number) => {
    console.log('Voir détails hôpital:', hospitalId)
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'public':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'private':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getTypeText = (type?: string) => {
    switch (type) {
      case 'public':
        return 'Public'
      case 'private':
        return 'Privé'
      default:
        return 'Non défini'
    }
  }

  return (
    <main className="p-6 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-50/10 dark:from-transparent dark:via-slate-800/20 dark:to-slate-900/10 min-h-screen">
      <div className="space-y-6">

        {/* Actions Bar - Design élégant et compact */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            {/* Recherche */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Rechercher par nom, ville ou adresse..."
                className="pl-10 w-72 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Trier
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => { setSortBy("nom"); setSortOrder("asc") }}>
                    Nom (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy("nom"); setSortOrder("desc") }}>
                    Nom (Z-A)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy("ville"); setSortOrder("asc") }}>
                    Ville (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy("type"); setSortOrder("asc") }}>
                    Type
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Bouton d'ajout */}
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm"
            onClick={() => router.push('/admin/manage-hospitals/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel hôpital
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total hôpitaux</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{hospitals.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Publics</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{hospitals.filter(h => h.type === 'public').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Privés</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{hospitals.filter(h => h.type === 'private').length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Résultats</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{filteredHospitals.length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Gestion des états de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-slate-600 dark:text-slate-400">Chargement des hôpitaux...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des hôpitaux: {error}</p>
          </div>
        )}

        {/* Hospitals Table - Design élégant et compact */}
        {!loading && !error && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-sm p-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Hôpital</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Localisation</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Type</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Contact</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHospitals.map((hospital, index) => (
                      <tr
                        key={hospital.id}
                        className={`border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white/30 dark:bg-slate-800/30' : 'bg-slate-50/30 dark:bg-slate-700/20'
                          }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white text-sm">{hospital.nom}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">ID: {hospital.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white text-sm">{hospital.ville}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{hospital.adresse}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getTypeColor(hospital.type)} font-medium`}>
                            {getTypeText(hospital.type)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {(hospital.telephone) && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-700 dark:text-slate-300">
                                  {hospital.telephone}
                                </span>
                              </div>
                            )}
                            {hospital.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-700 dark:text-slate-300">
                                  {hospital.email}
                                </span>
                              </div>
                            )}
                            {!hospital.telephone && !hospital.email && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">Non renseigné</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            {/* Actions standards */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(hospital.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(hospital.id)}
                              className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            {/* Menu d'actions supplémentaires */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(hospital.id)}>
                                  <Activity className="w-4 h-4 mr-2" />
                                  Voir les statistiques
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(hospital.id)}>
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Localiser sur la carte
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(hospital.id)}
                                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Message si aucun résultat */}
                {sortedHospitals.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Aucun hôpital trouvé</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

export default ManageHospitalsPage