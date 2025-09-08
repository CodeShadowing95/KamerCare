'use client';

import dynamic from 'next/dynamic';
import { Doctor } from '@/hooks/use-doctors';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    </div>
  )
});

interface MapWrapperProps {
  doctors: Doctor[];
  onDoctorSelect?: (doctor: Doctor) => void;
  className?: string;
}

export default function MapWrapper({ doctors, onDoctorSelect, className }: MapWrapperProps) {
  return (
    <div className={className}>
      <MapComponent doctors={doctors} onDoctorSelect={onDoctorSelect} />
    </div>
  );
}