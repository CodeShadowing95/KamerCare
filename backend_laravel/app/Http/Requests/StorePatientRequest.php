<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can create patients
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:patients,phone',
            'date_of_birth' => 'required|date|before:today',
            'gender' => ['required', Rule::in(['male', 'female', 'other'])],
            'address' => 'required|string|max:500',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:100',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'insurance_provider' => 'nullable|string|max:255',
            'insurance_number' => 'nullable|string|max:100',
            'blood_type' => ['nullable', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])],
            'password' => 'required|string|min:8|confirmed'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom de famille est obligatoire.',
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            'date_of_birth.required' => 'La date de naissance est obligatoire.',
            'date_of_birth.before' => 'La date de naissance doit être antérieure à aujourd\'hui.',
            'gender.required' => 'Le sexe est obligatoire.',
            'gender.in' => 'Le sexe doit être masculin, féminin ou autre.',
            'address.required' => 'L\'adresse est obligatoire.',
            'emergency_contact_name.required' => 'Le nom du contact d\'urgence est obligatoire.',
            'emergency_contact_phone.required' => 'Le téléphone du contact d\'urgence est obligatoire.',
            'emergency_contact_relationship.required' => 'La relation avec le contact d\'urgence est obligatoire.',
            'blood_type.in' => 'Le groupe sanguin doit être valide (A+, A-, B+, B-, AB+, AB-, O+, O-).',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'prénom',
            'last_name' => 'nom de famille',
            'email' => 'adresse email',
            'phone' => 'numéro de téléphone',
            'date_of_birth' => 'date de naissance',
            'gender' => 'sexe',
            'address' => 'adresse',
            'emergency_contact_name' => 'nom du contact d\'urgence',
            'emergency_contact_phone' => 'téléphone du contact d\'urgence',
            'emergency_contact_relationship' => 'relation avec le contact d\'urgence',
            'medical_history' => 'antécédents médicaux',
            'allergies' => 'allergies',
            'current_medications' => 'médicaments actuels',
            'insurance_provider' => 'assureur',
            'insurance_number' => 'numéro d\'assurance',
            'blood_type' => 'groupe sanguin',
            'password' => 'mot de passe'
        ];
    }
}
