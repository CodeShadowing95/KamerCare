<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDoctorRequest extends FormRequest
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
        $doctorId = $this->route('doctor');
        $doctor = $this->route('doctor') ? \App\Models\Doctor::find($doctorId) : null;
        $userId = $doctor ? $doctor->user_id : null;
        
        return [
            // User information
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($userId)
            ],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'],
            'phone' => [
                'sometimes', 
                'required', 
                'string', 
                'max:20', 
                Rule::unique('users')->ignore($userId)
            ],
            
            // Doctor specific information
            'specialization' => ['sometimes', 'required', 'array', 'min:1'],
            'specialization.*' => ['required', 'string', 'max:100'],
            'license_number' => [
                'sometimes', 
                'required', 
                'string', 
                'max:50', 
                Rule::unique('doctors')->ignore($doctorId)
            ],
            'years_of_experience' => ['sometimes', 'required', 'string', 'max:10'],
            'consultation_fee' => ['sometimes', 'required', 'numeric', 'min:0'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'office_address' => ['nullable', 'string', 'max:500'],
            'consultation_hours' => ['nullable', 'json'],
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
            
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
            
            'specialization.required' => 'La spécialisation est obligatoire.',
            'specialization.array' => 'La spécialisation doit être un tableau.',
            'specialization.min' => 'Au moins une spécialisation est requise.',
            'specialization.*.required' => 'Chaque spécialisation est obligatoire.',
            'specialization.*.string' => 'Chaque spécialisation doit être une chaîne de caractères.',
            'specialization.*.max' => 'Chaque spécialisation ne peut pas dépasser 100 caractères.',
            'license_number.required' => 'Le numéro de licence est obligatoire.',
            'license_number.unique' => 'Ce numéro de licence est déjà utilisé.',
            
            'years_of_experience.required' => 'Les années d\'expérience sont obligatoires.',
            'years_of_experience.string' => 'Les années d\'expérience doivent être une chaîne de caractères.',
            'years_of_experience.max' => 'Les années d\'expérience ne peuvent pas dépasser 10 caractères.',
            
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
            'consultation_hours' => 'heures de consultation',
            'is_available' => 'disponibilité',
        ];
    }
}
