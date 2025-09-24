import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Activity, Edit, Eye, Plus, Search } from 'lucide-react'
import React from 'react'

const specialties = [
  { id: 1, name: "Cardiologie", doctors: 23, appointments: 145, avgWait: 15 },
  { id: 2, name: "Pédiatrie", doctors: 18, appointments: 98, avgWait: 12 },
  { id: 3, name: "Gynécologie", doctors: 15, appointments: 87, avgWait: 18 },
  { id: 4, name: "Orthopédie", doctors: 12, appointments: 76, avgWait: 22 },
  { id: 5, name: "Dermatologie", doctors: 8, appointments: 54, avgWait: 10 },
]

const ManageSpecialtiesPage = () => {
  return (
    <main className="p-6 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-50/10 dark:from-transparent dark:via-slate-800/20 dark:to-slate-900/10 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input placeholder="Rechercher une spécialité..." className="pl-10 w-64" />
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle spécialité
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Spécialité</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Médecins</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">RDV ce mois</th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                      Temps d'attente moyen
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.map((specialty) => (
                    <tr key={specialty.id} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">{specialty.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white">{specialty.doctors}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white">{specialty.appointments}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white">{specialty.avgWait} min</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default ManageSpecialtiesPage