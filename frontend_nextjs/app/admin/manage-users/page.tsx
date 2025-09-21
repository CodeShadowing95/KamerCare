"use client"

import { useState, useRef, useEffect } from "react"
import {
  BarChart3,
  Users,
  Building2,
  Settings,
  Shield,
  FileText,
  Download,
  Search,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Activity,
  MapPin,
  CheckCircle,
  Calendar,
  DollarSign,
  Database,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Trash2,
  UserCheck,
  UserX,
  Filter,
  SortAsc,
  MoreHorizontal,
  ShieldX,
  ShieldCheck,
  ShieldAlert,
  SquareArrowOutUpRight,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useUsers } from "@/hooks/use-users"
import { useRouter } from "next/navigation"
import ContentHeader from "@/components/admin/content-header"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // Hook pour récupérer les utilisateurs
  const { users, loading, error, pagination, fetchUsers, toggleCertification } = useUsers({
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
    sort_by: sortBy,
    sort_order: sortOrder,
    per_page: 15
  })

  // Mettre à jour les données quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
        per_page: 15
      })
    }, 300) // Debounce de 300ms pour la recherche

    return () => clearTimeout(timeoutId)
  }, [searchTerm, roleFilter, statusFilter, sortBy, sortOrder])

  // Fonctions utilitaires pour les statuts
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  // Fonctions de gestion
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCertificationToggle = async (userId: number) => {
    try {
      const response = await toggleCertification(userId)
      console.log(`Certification toggled for user ${userId}:`, response.data)
    } catch (error: any) {
      console.error('Erreur lors du basculement de la certification:', error.message)
      // Vous pouvez ajouter ici une notification toast pour informer l'utilisateur
    }
  }

  const handleEdit = (userId: number) => {
    console.log(`Edit user ${userId}`)
  }

  const handleDelete = (userId: number) => {
    console.log(`Delete user ${userId}`)
  }

  const handleView = (userId: number) => {
    console.log(`View user ${userId}`)
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "doctor":
        return "Docteur"
      case "patient":
        return "Patient"
      case "admin":
        return "Administrateur"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "patient":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }


  return (
    <>
      {/* Top Bar avec dégradé élégant */}
      <ContentHeader title="Gestion des utilisateurs" subtitle="Gérez les informations des utilisateurs, docteurs, leurs rôles et leurs accès" />

      <main className="p-6 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-50/10 dark:from-transparent dark:via-slate-800/20 dark:to-slate-900/10 min-h-screen">
        <div className="space-y-6">
          {/* Actions Bar - Design élégant et compact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
              {/* Recherche */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input 
                  placeholder="Rechercher par nom ou email..." 
                  className="pl-10 w-72 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 transition-all duration-200" 
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {/* Filtres */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="patient">Patients</SelectItem>
                    <SelectItem value="doctor">Docteurs</SelectItem>
                    <SelectItem value="admin">Administrateurs</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
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
                    <DropdownMenuItem onClick={() => {setSortBy("name"); setSortOrder("asc")}}>
                      Nom (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {setSortBy("name"); setSortOrder("desc")}}>
                      Nom (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {setSortBy("role"); setSortOrder("asc")}}>
                      Rôle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {setSortBy("lastLogin"); setSortOrder("desc")}}>
                      Dernière connexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Bouton d'ajout */}
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total utilisateurs</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pagination?.total || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Docteurs</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{users.filter(u => u.role === 'doctor').length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patients</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{users.filter(u => u.role === 'patient').length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Actifs</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Gestion des états de chargement et d'erreur */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600 dark:text-slate-400">Chargement des utilisateurs...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">Erreur lors du chargement des utilisateurs: {error}</p>
            </div>
          )}

          {/* Users Table - Design élégant et compact */}
          {!loading && !error && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 shadow-sm p-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Utilisateur</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Rôle</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Hôpital</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Dernière connexion</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Statut</th>
                      <th className="text-left p-4 font-semibold text-slate-900 dark:text-white text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.id} 
                        className={`border-t border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-150 ${
                          index % 2 === 0 ? 'bg-white/30 dark:bg-slate-800/30' : 'bg-slate-50/30 dark:bg-slate-700/20'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 border-2 border-white/50 dark:border-slate-600/50 shadow-sm">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getRoleColor(user.role)} font-medium`}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                          {user.role === 'doctor' && (
                            <div className="mt-1">
                              <Badge 
                                variant={user.certified ? "default" : "secondary"} 
                                className={`text-xs ${
                                  user.certified 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                    : "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-400"
                                }`}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {user.certified ? (
                                      <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4" />
                                        Certifié
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <ShieldAlert className="w-4 h-4" />
                                        Non Certifié
                                      </div>
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="text-xs bg-slate-900 text-white max-w-[300px] dark:bg-slate-700 dark:text-white"
                                  >
                                    Vous devez vous référer au <a href="https://onmc.app/tableau_de_lordre" target="_blank" className="text-blue-400 hover:underline">Tableau de l'Ordre National des Médecins du Cameroun <SquareArrowOutUpRight className="w-2.5 h-2.5 inline-block" /></a> pour pouvoir marquer un docteur comme certifié.
                                  </TooltipContent>
                                </Tooltip>
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-slate-900 dark:text-white font-medium">{user.hospital}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-700 dark:text-slate-300">{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(user.status)} font-medium`}>
                            {getStatusText(user.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1">
                            {/* Actions standards pour tous les utilisateurs */}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleView(user.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(user.id)}
                              className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            {/* Bouton spécial pour les docteurs - Certification */}
                            {user.role === 'doctor' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCertificationToggle(user.id)}
                                className={`h-8 w-8 p-0 transition-colors duration-200 ${
                                  user.certified 
                                    ? "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400" 
                                    : "hover:bg-green-100 dark:hover:bg-green-900/30 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
                                }`}
                                title={user.certified ? "Marquer comme Non Certifié" : "Marquer comme Certifié"}
                              >
                                {user.certified ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                              </Button>
                            )}
                            
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
                                {user.role === 'doctor' && (
                                  <DropdownMenuItem onClick={() => handleCertificationToggle(user.id)}>
                                    {user.certified ? <ShieldX className="w-4 h-4 mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                                    {user.certified ? "Marquer comme Non Certifié" : "Marquer comme Certifié"}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                                  <Activity className="w-4 h-4 mr-2" />
                                  Consulter les logs
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleView(user.id)}>
                                  {user.status === 'active' ? <Ban className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                                  {user.status === 'active' ? "Désactiver le compte" : "Activer le compte"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(user.id)}
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
                {users.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Aucun utilisateur trouvé</p>
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
    </>
  )
}

export default ManageUsersPage