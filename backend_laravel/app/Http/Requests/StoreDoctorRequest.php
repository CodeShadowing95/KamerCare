<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDoctorRequest extends FormRequest
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
            // User information
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:20', 'unique:users'],
            
            // Doctor specific information
            'specialization' => ['required', 'string', 'max:100'],
            'license_number' => ['required', 'string', 'max:50', 'unique:doctors'],
            'years_of_experience' => ['required', 'integer', 'min:0', 'max:60'],
            'consultation_fee' => ['required', 'numeric', 'min:0'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'office_address' => ['nullable', 'string', 'max:500'],
            'working_hours' => ['nullable', 'json'],
            'is_available' => ['boolean'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            
            'specialization.required' => 'La spécialisation est obligatoire.',
            'license_number.required' => 'Le numéro de licence est obligatoire.',
            'license_number.unique' => 'Ce numéro de licence est déjà utilisé.',
            
            'years_of_experience.required' => 'Les années d\'expérience sont obligatoires.',
            'years_of_experience.integer' => 'Les années d\'expérience doivent être un nombre entier.',
            'years_of_experience.min' => 'Les années d\'expérience ne peuvent pas être négatives.',
            'years_of_experience.max' => 'Les années d\'expérience ne peuvent pas dépasser 60 ans.',
            
            'consultation_fee.required' => 'Les frais de consultation sont obligatoires.',
            'consultation_fee.numeric' => 'Les frais de consultation doivent être un nombre.',
            'consultation_fee.min' => 'Les frais de consultation ne peuvent pas être négatifs.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'email' => 'adresse email',
            'password' => 'mot de passe',
            'phone' => 'téléphone',
            'specialization' => 'spécialisation',
            'license_number' => 'numéro de licence',
            'years_of_experience' => 'années d\'expérience',
            'consultation_fee' => 'frais de consultation',
            'bio' => 'biographie',
            'office_address' => 'adresse du cabinet',
            'working_hours' => 'heures de travail',
            'is_available' => 'disponibilité',
        ];
    }
}
