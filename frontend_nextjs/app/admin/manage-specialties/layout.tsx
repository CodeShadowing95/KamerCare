import ContentHeader from '@/components/admin/content-header'
import React from 'react'

const ManageSpecialtiesLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
    <ContentHeader title="Gestion des spécialités" subtitle="Gérez les spécialités médicales disponibles" />
    {children}
    </>
  )
}

export default ManageSpecialtiesLayout