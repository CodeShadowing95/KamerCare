'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface Patient {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  display: string;
}

interface AppointmentForm {
  patient_id: number | null;
  personName: string;
  personEmail: string;
  personPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  reason: string;
  notes: string;
  priority: string;
  appointment_type: string;
}

interface FormErrors {
  personName?: string;
  personPhone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  reason?: string;
  appointment_type?: string;
  general?: string;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<AppointmentForm>({
    patient_id: null,
    personName: '',
    personEmail: '',
    personPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    reason: '',
    notes: '',
    priority: 'normal',
    appointment_type: 'presentiel'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction de recherche de patients
  const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`http://localhost:8000/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche de patients');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur de recherche:', error);
      return [];
    }
  };

  // Fonction de sélection d'une personne
  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patient_id: patient.id,
      personName: patient.full_name,
      personEmail: patient.email,
      personPhone: patient.phone
    }));
    
    // Clear errors when person is selected
    setErrors(prev => ({
      ...prev,
      personName: undefined,
      personPhone: undefined
    }));
  };

  const handleInputChange = (field: keyof AppointmentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.patient_id || !formData.personName.trim()) {
      newErrors.personName = 'Veuillez sélectionner une personne';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'La date du rendez-vous est requise';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'L\'heure du rendez-vous est requise';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Le motif de consultation est requis';
    }

    if (!formData.appointment_type) {
      newErrors.appointment_type = 'Le type de rendez-vous est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const appointmentDateTime = `${formData.appointmentDate} ${formData.appointmentTime}:00`;
      
      const appointmentData = {
        patient_id: formData.patient_id, // ID de l'utilisateur patient
        doctor_id: user?.id, // ID du docteur depuis la relation
        appointment_date: appointmentDateTime,
        duration_minutes: parseInt(formData.duration),
        reason_for_visit: formData.reason,
        notes: formData.notes || null,
        consultation_fee: 0.00, // Default fee, could be made configurable
        appointment_type: formData.appointment_type
      };

      const response = await fetch('http://localhost:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création du rendez-vous');
      }

      const result = await response.json();
      setSuccessMessage('Rendez-vous créé avec succès!');
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/doctor?success=appointment-created');
      }, 2000);

    } catch (error: any) {
      console.error('Erreur lors de la création du RDV:', error);
      setErrors({ general: error.message || 'Une erreur est survenue lors de la création du rendez-vous' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      {/* En-tête */}
      <div className="mb-8">
        {/* <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div> */}

        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau Rendez-vous</h1>
            <p className="text-gray-600 mt-1">Planifier un nouveau rendez-vous patient</p>
          </div>
        </div>
      </div>

      {/* Messages d'erreur et de succès */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{errors.general}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations Patient */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Informations Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Autocomplete
                  label="Nom complet"
                  placeholder="Rechercher un patient par nom, email ou téléphone..."
                  value={formData.personName}
                onChange={(value) => handleInputChange('personName', value)}
                  onSelect={handlePatientSelect}
                  onSearch={searchPatients}
                  error={errors.personName}
                  required
                />
              </div>

              <div>
                <Label htmlFor="personEmail" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="personEmail"
                type="email"
                value={formData.personEmail}
                    placeholder="Sélectionnez un patient pour remplir automatiquement"
                    className="pl-10 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="personPhone" className="text-sm font-medium text-gray-700">
                  Téléphone
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="personPhone"
                value={formData.personPhone}
                    placeholder="Sélectionnez un patient pour remplir automatiquement"
                    className="pl-10 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du Rendez-vous */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-purple-600" />
                Détails du Rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointmentDate" className="text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                    className={`mt-1 ${errors.appointmentDate ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {errors.appointmentDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.appointmentDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="appointmentTime" className="text-sm font-medium text-gray-700">
                    Heure <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
                    className={`mt-1 ${errors.appointmentTime ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  {errors.appointmentTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.appointmentTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                    Durée (minutes)
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="90">1h30</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                    Priorité
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="appointment_type" className="text-sm font-medium text-gray-700">
                  Type de rendez-vous <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.appointment_type} onValueChange={(value) => handleInputChange('appointment_type', value)}>
                  <SelectTrigger className={`mt-1 ${errors.appointment_type ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presentiel">Présentiel</SelectItem>
                    <SelectItem value="visio">Visioconférence</SelectItem>
                    <SelectItem value="domicile">À domicile</SelectItem>
                    <SelectItem value="urgence">Urgence</SelectItem>
                    <SelectItem value="suivi">Suivi</SelectItem>
                  </SelectContent>
                </Select>
                {errors.appointment_type && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.appointment_type}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motif et Notes */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-green-600" />
              Motif et Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
                Motif de consultation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Ex: Consultation de routine, Suivi post-opératoire..."
                className={`mt-1 ${errors.reason ? 'border-red-500 focus:border-red-500' : ''}`}
                required
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.reason}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes additionnelles
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Informations complémentaires, préparation spéciale, allergies..."
                className="mt-1 min-h-[100px]"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Annuler
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Création...' : 'Créer le RDV'}
          </Button>
        </div>
      </form>
    </>
  );
}