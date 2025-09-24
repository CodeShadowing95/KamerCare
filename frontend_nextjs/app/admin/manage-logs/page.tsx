import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'
import React from 'react'

const recentActivities = [
  { id: 1, action: "Nouveau rendez-vous créé", user: "Jean Mballa", time: "5 min", type: "appointment" },
  { id: 2, action: "Hôpital ajouté au système", user: "Admin System", time: "1h", type: "hospital" },
  { id: 3, action: "Utilisateur suspendu", user: "Admin Yaoundé", time: "2h", type: "user" },
  { id: 4, action: "Rapport mensuel généré", user: "System", time: "3h", type: "report" },
]

const ManageLogsPage = () => {
  return (
    <main className="p-6 bg-gradient-to-br from-transparent via-blue-50/20 to-indigo-50/10 dark:from-transparent dark:via-slate-800/20 dark:to-slate-900/10 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les logs</SelectItem>
                <SelectItem value="error">Erreurs</SelectItem>
                <SelectItem value="warning">Avertissements</SelectItem>
                <SelectItem value="info">Informations</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="w-40" />
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter logs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Journaux système</CardTitle>
            <CardDescription className="font-serif">Activité et événements du système</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${activity.type === "appointment"
                        ? "bg-green-500"
                        : activity.type === "hospital"
                          ? "bg-blue-500"
                          : activity.type === "user"
                            ? "bg-yellow-500"
                            : "bg-purple-500"
                        }`}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">par {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-500">il y a {activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default ManageLogsPage