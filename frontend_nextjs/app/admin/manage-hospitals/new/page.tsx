'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Save, X, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { z } from 'zod';
import { apiService } from '@/lib/api';

// Schéma de validation Zod
const hospitalSchema = z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    type: z.enum(['public', 'private'], {
        required_error: 'Le type est requis',
        invalid_type_error: 'Le type doit être "public" ou "private"',
    }),
    adresse: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
    ville: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
    indicatif: z.string().optional(),
    telephone: z.string().refine((val) => val === '' || val.length >= 8, {
        message: 'Le téléphone doit contenir au moins 8 chiffres'
    }).optional(),
    email: z.string().email('Format d\'email invalide')
});

type HospitalForm = z.infer<typeof hospitalSchema>;

interface FormErrors {
    nom?: string;
    type?: string;
    adresse?: string;
    ville?: string;
    indicatif?: string;
    telephone?: string;
    email?: string;
    general?: string;
}

export default function NewHospitalPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<HospitalForm>({
        nom: '',
        type: 'public',
        adresse: '',
        ville: '',
        indicatif: '+237',
        telephone: '',
        email: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (field: keyof HospitalForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        try {
            hospitalSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof FormErrors] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await apiService.createHospital(formData);
            setSuccessMessage('Hôpital créé avec succès!');

            // Redirection après 2 secondes
            setTimeout(() => {
                router.push('/admin/manage-hospitals?success=hospital-created');
            }, 2000);

        } catch (error: any) {
            console.error('Erreur lors de la création de l\'hôpital:', error);
            setErrors({
                general: error.message || 'Une erreur est survenue lors de la création de l\'hôpital'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
    router.back();
  };

  // Vérifier si les champs obligatoires sont remplis
  const isFormValid = formData.nom.trim() !== '' && 
                     formData.adresse.trim() !== '' && 
                     formData.ville.trim() !== '';

  return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* En-tête */}
            {/* <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Nouvel Hôpital</h1>
                        <p className="text-gray-600 mt-1">Ajouter un nouvel établissement de santé</p>
                    </div>
                </div>
            </div> */}

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
            <form onSubmit={handleSubmit} className="w-full">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Nouvel Hôpital</h1>
                                <p className="text-gray-600">Ajouter un nouvel établissement de santé</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Nom de l'hôpital */}
                        <div>
                            <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                                Nom de l'hôpital <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => handleInputChange('nom', e.target.value)}
                                placeholder="Ex: Hôpital Central de Yaoundé"
                                className={`mt-0.5 h-9 ${errors.nom ? 'border-red-500 focus:border-red-500' : ''}`}
                                required
                            />
                            {errors.nom && (
                                <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.nom}
                                </p>
                            )}
                        </div>

                        {/* Type d'établissement */}
                        <div>
                            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Type d'établissement <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                <SelectTrigger className={`mt-0.5 h-9 ${errors.type ? 'border-red-500 focus:border-red-500' : ''}`}>
                                    <SelectValue placeholder="Public" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Hôpital Public</SelectItem>
                                    <SelectItem value="private">Hôpital Privé</SelectItem>
                                    <SelectItem value="clinique">Clinique</SelectItem>
                                    <SelectItem value="centre_medical">Centre Médical</SelectItem>
                                    <SelectItem value="dispensaire">Dispensaire</SelectItem>
                                    <SelectItem value="centre_specialise">Centre Spécialisé</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Adresse et Ville */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="adresse" className="text-sm font-medium text-gray-700">
                                    Adresse <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative mt-0.5">
                                    <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <Input
                                        id="adresse"
                                        value={formData.adresse}
                                        onChange={(e) => handleInputChange('adresse', e.target.value)}
                                        placeholder="Ex: Avenue Kennedy, Quartier Bastos"
                                        className={`pl-9 h-9 ${errors.adresse ? 'border-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.adresse && (
                                    <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.adresse}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="ville" className="text-sm font-medium text-gray-700">
                                    Ville <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ville"
                                    value={formData.ville}
                                    onChange={(e) => handleInputChange('ville', e.target.value)}
                                    placeholder="Ex: Yaoundé"
                                    className={`mt-0.5 h-9 ${errors.ville ? 'border-red-500 focus:border-red-500' : ''}`}
                                    required
                                />
                                {errors.ville && (
                                    <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.ville}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Téléphone et Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="telephone" className="text-sm font-medium text-gray-700">
                                    Téléphone <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2 mt-0.5">
                                    {/* Sélecteur d'indicatif */}
                                    <Select value={formData.indicatif} onValueChange={(value) => handleInputChange('indicatif', value)}>
                                        <SelectTrigger className="w-28 h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="+237">🇨🇲 +237</SelectItem>
                                            <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                            <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                            <SelectItem value="+39">🇮🇹 +39</SelectItem>
                                            <SelectItem value="+34">🇪🇸 +34</SelectItem>
                                            <SelectItem value="+41">🇨🇭 +41</SelectItem>
                                            <SelectItem value="+32">🇧🇪 +32</SelectItem>
                                            <SelectItem value="+31">🇳🇱 +31</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    {/* Champ numéro de téléphone */}
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                        <Input
                                            id="telephone"
                                            value={formData.telephone}
                                            onChange={(e) => handleInputChange('telephone', e.target.value)}
                                            placeholder="6XX XX XX XX"
                                            className={`pl-9 h-9 ${errors.telephone ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                    </div>
                                </div>
                                {(errors.indicatif || errors.telephone) && (
                                    <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.indicatif || errors.telephone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative mt-0.5">
                                    <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Ex: contact@hopital.cm"
                                        className={`pl-9 h-9 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-0.5 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        size="sm"
                        className="flex items-center gap-1.5"
                    >
                        <X className="h-3.5 w-3.5" />
                        Annuler
                    </Button>

                    <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            size="sm"
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-3.5 w-3.5" />
            {isSubmitting ? 'Création...' : 'Créer l\'Hôpital'}
          </Button>
                </div>
            </form>
        </div>
    );
}