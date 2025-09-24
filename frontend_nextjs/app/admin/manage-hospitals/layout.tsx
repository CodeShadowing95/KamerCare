import ContentHeader from '@/components/admin/content-header'
import React from 'react'

const ManageHospitalslayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
    <ContentHeader title="Gestion des hôpitaux" subtitle="Gérez les informations des hôpitaux, leurs types et leurs coordonnées" />
    {children}
    </>
  )
}

export default ManageHospitalslayout