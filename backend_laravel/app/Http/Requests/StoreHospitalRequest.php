<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHospitalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Permettre à tous les utilisateurs authentifiés de créer des hôpitaux
        // Vous pouvez ajuster cette logique selon vos besoins d'autorisation
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'nom' => [
                'required',
                'string',
                'min:2',
                'max:100',
                'unique:hospitals,nom'
            ],
            'type' => [
                'required',
                Rule::in(['public', 'private'])
            ],
            'adresse' => [
                'required',
                'string',
                'min:5',
                'max:200'
            ],
            'ville' => [
                'required',
                'string',
                'min:2',
                'max:50'
            ],
            'telephone' => [
                'nullable',
                'string',
                'regex:/^(\+237|237)?[2-9]\d{8}$/',
                'unique:hospitals,telephone'
            ],
            'email' => [
                'required',
                'email',
                'max:100',
                'unique:hospitals,email'
            ],
            'photo' => [
                'nullable',
                'url',
                'max:255'
            ]
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de l\'hôpital est obligatoire.',
            'nom.min' => 'Le nom doit contenir au moins 2 caractères.',
            'nom.max' => 'Le nom ne peut pas dépasser 100 caractères.',
            'nom.unique' => 'Un hôpital avec ce nom existe déjà.',
            
            'type.required' => 'Le type d\'hôpital est obligatoire.',
            'type.in' => 'Le type doit être soit "public" soit "private".',
            
            'adresse.required' => 'L\'adresse est obligatoire.',
            'adresse.min' => 'L\'adresse doit contenir au moins 5 caractères.',
            'adresse.max' => 'L\'adresse ne peut pas dépasser 200 caractères.',
            
            'ville.required' => 'La ville est obligatoire.',
            'ville.min' => 'La ville doit contenir au moins 2 caractères.',
            'ville.max' => 'La ville ne peut pas dépasser 50 caractères.',
            
            'telephone.regex' => 'Le format du numéro de téléphone est invalide (format attendu: +237XXXXXXXXX).',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé par un autre hôpital.',
            
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email n\'est pas valide.',
            'email.max' => 'L\'adresse email ne peut pas dépasser 100 caractères.',
            'email.unique' => 'Cette adresse email est déjà utilisée par un autre hôpital.',
            
            'photo.url' => 'L\'URL de la photo n\'est pas valide.',
            'photo.max' => 'L\'URL de la photo ne peut pas dépasser 255 caractères.'
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'nom' => 'nom de l\'hôpital',
            'type' => 'type d\'hôpital',
            'adresse' => 'adresse',
            'ville' => 'ville',
            'telephone' => 'numéro de téléphone',
            'email' => 'adresse email',
            'photo' => 'photo'
        ];
    }
}