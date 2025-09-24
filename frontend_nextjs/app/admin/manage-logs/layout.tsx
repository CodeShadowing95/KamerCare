import ContentHeader from '@/components/admin/content-header'
import React from 'react'

const ManageLogsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <ContentHeader title="Gestion des journaux d'activités" subtitle="Consultez les journaux d'activités de l'application" />
    {children}
    </>
  )
}

export default ManageLogsLayout