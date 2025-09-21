"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'

interface DoctorSpecializationProps {
  specialization: string | null | undefined
  className?: string
  maxWidth?: string
  showRemoveButtons?: boolean
  onRemove?: (spec: string) => void
}

interface TooltipProps {
  children: React.ReactNode
  content: string
  show: boolean
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, show }) => {
  return (
    <div className="relative inline-block">
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg py-2 px-3 shadow-lg max-w-xs whitespace-normal">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export const DoctorSpecialization: React.FC<DoctorSpecializationProps> = ({
  specialization,
  className = '',
  maxWidth = 'max-w-[200px]',
  showRemoveButtons = false,
  onRemove
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  // Gérer le cas où la spécialisation est null, undefined ou vide
  if (!specialization || specialization.trim() === '') {
    return (
      <span className={cn('text-gray-500 dark:text-gray-400 text-sm italic', className)}>
        Non spécifiée
      </span>
    )
  }

  // Nettoyer et séparer les spécialisations
  const specializations = specialization
    .split(',')
    .map(spec => spec.trim())
    .filter(spec => spec.length > 0)

  // Si une seule spécialisation, l'afficher directement
  if (specializations.length <= 1) {
    return (
      <span className={cn('text-sm font-medium truncate', maxWidth, className)}>
        {specializations[0] || 'Non spécifiée'}
      </span>
    )
  }

  // Plusieurs spécialisations : afficher la première + indicateur
  const firstSpecialization = specializations[0]
  const remainingCount = specializations.length - 1
  const remainingSpecializations = specializations.slice(1)
  const tooltipContent = remainingSpecializations.join(', ')

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Première spécialisation */}
      <span className={cn('text-xs font-medium truncate', maxWidth)}>
        {firstSpecialization}
        {showRemoveButtons && onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(firstSpecialization);
            }}
            className="ml-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full p-0.5 transition-colors"
            aria-label={`Supprimer ${firstSpecialization}`}
          >
            x
          </button>
        )}
      </span>
      
      {/* Indicateur avec tooltip */}
      <Tooltip 
        content={tooltipContent}
        show={showTooltip}
      >
        <span
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          tabIndex={0}
          role="button"
          aria-label={`${remainingCount} autres spécialisations: ${tooltipContent}`}
        >
          <Info className="w-3 h-3 text-slate-500 hover:text-slate-700 cursor-help" />
        </span>
      </Tooltip>
    </div>
  )
}

export default DoctorSpecialization