'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, User } from 'lucide-react';

interface Patient {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  display: string;
}

interface AutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (patient: Patient) => void;
  onSearch: (query: string) => Promise<Patient[]>;
  error?: string;
  required?: boolean;
}

export function Autocomplete({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  onSearch,
  error,
  required = false
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length >= 2) {
      setLoading(true);
      try {
        const results = await onSearch(newValue);
        setOptions(results);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setOptions([]);
      setIsOpen(false);
    }
  };

  const handleOptionSelect = (patient: Patient) => {
    onChange(patient.full_name);
    onSelect(patient);
    setIsOpen(false);
    setOptions([]);
  };

  return (
    <div className="relative">
      <Label htmlFor={label.toLowerCase().replace(' ', '-')} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative mt-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.length >= 2 && options.length > 0) {
              setIsOpen(true);
            }
          }}
          className={`pr-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto backdrop-blur-sm"
        >
          {options.map((patient) => (
            <div
              key={patient.id}
              className="px-3 py-2.5 cursor-pointer hover:bg-blue-50 hover:border-l-4 hover:border-l-blue-500 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
              onClick={() => handleOptionSelect(patient)}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex-shrink-0">
                  <User className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-700">
                    {patient.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate group-hover:text-blue-600">
                    {patient.email} • {patient.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && options.length === 0 && !loading && value.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl backdrop-blur-sm"
        >
          <div className="px-3 py-2.5 text-xs text-gray-500 italic">
            Aucune personne trouvée
          </div>
        </div>
      )}
    </div>
  );
}