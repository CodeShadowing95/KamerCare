import SidebarAdmin from '@/components/admin/sidebar'
import React from 'react'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <SidebarAdmin />
        {/* Main Content */}
        <div className="ml-72">
            {children}
        </div>
    </div>
  )
}

export default AdminLayout