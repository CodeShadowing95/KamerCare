"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHospitalSearch, Hospital } from "@/hooks/use-hospitals"

interface HospitalSelectProps {
  value?: string | number | null
  onValueChange: (value: string | number | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export function HospitalSelect({
  value,
  onValueChange,
  placeholder = "Sélectionner un hôpital...",
  className,
  disabled = false,
  required = false
}: HospitalSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const { searchTerm, setSearchTerm, hospitals, loading, error } = useHospitalSearch()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mettre à jour l'hôpital sélectionné quand la valeur change
  useEffect(() => {
    if (value) {
      const hospital = hospitals.find(h => h.id.toString() === value.toString())
      setSelectedHospital(hospital || null)
    } else {
      setSelectedHospital(null)
    }
  }, [value, hospitals])

  // Focus sur l'input quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (hospital: Hospital | null) => {
    if (hospital) {
      setSelectedHospital(hospital)
      onValueChange(hospital.id)
    } else {
      setSelectedHospital(null)
      onValueChange(null)
    }
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleSelect(null)
  }

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border-2 border-gray-200 bg-gray-50/50 px-3 py-2 text-sm transition-all duration-300",
          "hover:bg-white hover:shadow-md focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none",
          disabled && "cursor-not-allowed opacity-50",
          isOpen && "border-teal-500 ring-2 ring-teal-200",
          error && "border-red-300 focus:border-red-500 focus:ring-red-200"
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedHospital ? (
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="font-medium text-gray-900 truncate">
                {selectedHospital.nom}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {selectedHospital.ville}
              </span>
            </div>
          ) : value === null ? (
            <span className="text-gray-700 font-medium">Aucun sélectionné</span>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {(selectedHospital || value === null) && !disabled && (
            <div
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </div>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full -translate-y-1 z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un hôpital..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {/* Option "Aucun" */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={cn(
                "w-full p-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3",
                value === null && "bg-teal-50 text-teal-700"
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {value === null && <Check className="w-4 h-4" />}
              </div>
              <div>
                <div className="font-medium text-gray-600">Aucun</div>
                <div className="text-xs text-gray-400">Pas d'hôpital de fonction</div>
              </div>
            </button>

            {loading && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                Chargement des hôpitaux...
              </div>
            )}

            {error && (
              <div className="px-3 py-4 text-center text-red-500 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && filteredHospitals.length === 0 && searchTerm && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                Aucun hôpital trouvé pour "{searchTerm}"
              </div>
            )}

            {/* {!loading && !error && filteredHospitals.length === 0 && !searchTerm && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                Aucun hôpital disponible
              </div>
            )} */}

            {filteredHospitals.map((hospital) => (
              <button
                key={hospital.id}
                type="button"
                onClick={() => handleSelect(hospital)}
                className={cn(
                  "w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3",
                  selectedHospital?.id === hospital.id && "bg-teal-50 text-teal-700"
                )}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {selectedHospital?.id === hospital.id && <Check className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {hospital.nom}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {hospital.ville} • {hospital.adresse}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}