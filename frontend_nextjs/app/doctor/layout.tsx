'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DoctorSidebar } from '@/components/doctor/dashboard-doctor/sidebar';
import { DoctorNavbar } from '@/components/doctor/dashboard-doctor/navbar';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export default function DoctorLayout({ children }: DoctorLayoutProps) {
  const [activeItem, setActiveItem] = useState('overview');
  const pathname = usePathname();

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Pages d'authentification qui ne doivent pas avoir la sidebar/navbar
  const authPages = ['/doctor/login', '/doctor/signup'];
  const isAuthPage = authPages.includes(pathname);

  // Si c'est une page d'authentification, retourner seulement les children
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DoctorSidebar 
        activeItem={activeItem}
        onItemClick={handleItemClick}
      />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <DoctorNavbar />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}