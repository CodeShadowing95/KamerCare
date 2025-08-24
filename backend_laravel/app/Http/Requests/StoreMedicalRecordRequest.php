<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalRecordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'visit_date' => ['required', 'date', 'before_or_equal:today'],
            'chief_complaint' => ['required', 'string', 'max:500'],
            'history_of_present_illness' => ['nullable', 'string', 'max:2000'],
            'past_medical_history' => ['nullable', 'string', 'max:1000'],
            'medications' => ['nullable', 'string', 'max:1000'],
            'allergies' => ['nullable', 'string', 'max:500'],
            'social_history' => ['nullable', 'string', 'max:500'],
            'family_history' => ['nullable', 'string', 'max:500'],
            'physical_examination' => ['nullable', 'string', 'max:2000'],
            'vital_signs' => ['nullable', 'json'],
            'diagnosis' => ['required', 'string', 'max:1000'],
            'treatment_plan' => ['required', 'string', 'max:2000'],
            'prescriptions' => ['nullable', 'json'],
            'lab_results' => ['nullable', 'json'],
            'imaging_results' => ['nullable', 'json'],
            'follow_up_instructions' => ['nullable', 'string', 'max:1000'],
            'next_appointment_date' => ['nullable', 'date', 'after:today'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'], // 5MB max
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'Le patient est obligatoire.',
            'patient_id.exists' => 'Le patient sélectionné n\'existe pas.',
            
            'doctor_id.required' => 'Le docteur est obligatoire.',
            'doctor_id.exists' => 'Le docteur sélectionné n\'existe pas.',
            
            'appointment_id.exists' => 'Le rendez-vous sélectionné n\'existe pas.',
            
            'visit_date.required' => 'La date de visite est obligatoire.',
            'visit_date.date' => 'La date de visite doit être une date valide.',
            'visit_date.before_or_equal' => 'La date de visite ne peut pas être dans le futur.',
            
            'chief_complaint.required' => 'Le motif principal de consultation est obligatoire.',
            'chief_complaint.max' => 'Le motif principal ne peut pas dépasser 500 caractères.',
            
            'history_of_present_illness.max' => 'L\'histoire de la maladie actuelle ne peut pas dépasser 2000 caractères.',
            'past_medical_history.max' => 'Les antécédents médicaux ne peuvent pas dépasser 1000 caractères.',
            'medications.max' => 'Les médicaments ne peuvent pas dépasser 1000 caractères.',
            'allergies.max' => 'Les allergies ne peuvent pas dépasser 500 caractères.',
            'social_history.max' => 'L\'histoire sociale ne peut pas dépasser 500 caractères.',
            'family_history.max' => 'Les antécédents familiaux ne peuvent pas dépasser 500 caractères.',
            'physical_examination.max' => 'L\'examen physique ne peut pas dépasser 2000 caractères.',
            
            'diagnosis.required' => 'Le diagnostic est obligatoire.',
            'diagnosis.max' => 'Le diagnostic ne peut pas dépasser 1000 caractères.',
            
            'treatment_plan.required' => 'Le plan de traitement est obligatoire.',
            'treatment_plan.max' => 'Le plan de traitement ne peut pas dépasser 2000 caractères.',
            
            'follow_up_instructions.max' => 'Les instructions de suivi ne peuvent pas dépasser 1000 caractères.',
            
            'next_appointment_date.date' => 'La date du prochain rendez-vous doit être une date valide.',
            'next_appointment_date.after' => 'La date du prochain rendez-vous doit être dans le futur.',
            
            'notes.max' => 'Les notes ne peuvent pas dépasser 2000 caractères.',
            
            'attachments.array' => 'Les pièces jointes doivent être un tableau.',
            'attachments.*.file' => 'Chaque pièce jointe doit être un fichier valide.',
            'attachments.*.mimes' => 'Les pièces jointes doivent être des fichiers PDF, DOC, DOCX, JPG, JPEG ou PNG.',
            'attachments.*.max' => 'Chaque pièce jointe ne peut pas dépasser 5MB.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'patient_id' => 'patient',
            'doctor_id' => 'docteur',
            'appointment_id' => 'rendez-vous',
            'visit_date' => 'date de visite',
            'chief_complaint' => 'motif principal',
            'history_of_present_illness' => 'histoire de la maladie actuelle',
            'past_medical_history' => 'antécédents médicaux',
            'medications' => 'médicaments',
            'allergies' => 'allergies',
            'social_history' => 'histoire sociale',
            'family_history' => 'antécédents familiaux',
            'physical_examination' => 'examen physique',
            'vital_signs' => 'signes vitaux',
            'diagnosis' => 'diagnostic',
            'treatment_plan' => 'plan de traitement',
            'prescriptions' => 'prescriptions',
            'lab_results' => 'résultats de laboratoire',
            'imaging_results' => 'résultats d\'imagerie',
            'follow_up_instructions' => 'instructions de suivi',
            'next_appointment_date' => 'date du prochain rendez-vous',
            'notes' => 'notes',
            'attachments' => 'pièces jointes',
        ];
    }
}
