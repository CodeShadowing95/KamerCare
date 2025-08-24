<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class UpdateAppointmentRequest extends FormRequest
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
            'doctor_id' => ['sometimes', 'required', 'exists:doctors,id'],
            'patient_id' => ['sometimes', 'required', 'exists:patients,id'],
            'appointment_date' => [
                'sometimes', 
                'required', 
                'date', 
                'after:now',
                function ($attribute, $value, $fail) {
                    $date = Carbon::parse($value);
                    if ($date->isWeekend()) {
                        $fail('Les rendez-vous ne peuvent pas être programmés le week-end.');
                    }
                    if ($date->hour < 8 || $date->hour >= 18) {
                        $fail('Les rendez-vous doivent être programmés entre 8h00 et 18h00.');
                    }
                }
            ],
            'reason' => ['sometimes', 'required', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'string', 'in:scheduled,confirmed,completed,cancelled'],
            'duration' => ['sometimes', 'integer', 'min:15', 'max:180'], // en minutes
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'doctor_id.required' => 'Le docteur est obligatoire.',
            'doctor_id.exists' => 'Le docteur sélectionné n\'existe pas.',
            
            'patient_id.required' => 'Le patient est obligatoire.',
            'patient_id.exists' => 'Le patient sélectionné n\'existe pas.',
            
            'appointment_date.required' => 'La date du rendez-vous est obligatoire.',
            'appointment_date.date' => 'La date du rendez-vous doit être une date valide.',
            'appointment_date.after' => 'La date du rendez-vous doit être dans le futur.',
            
            'reason.required' => 'La raison du rendez-vous est obligatoire.',
            'reason.max' => 'La raison ne peut pas dépasser 500 caractères.',
            
            'notes.max' => 'Les notes ne peuvent pas dépasser 1000 caractères.',
            
            'status.in' => 'Le statut doit être: programmé, confirmé, terminé ou annulé.',
            
            'duration.integer' => 'La durée doit être un nombre entier.',
            'duration.min' => 'La durée minimale est de 15 minutes.',
            'duration.max' => 'La durée maximale est de 180 minutes.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'doctor_id' => 'docteur',
            'patient_id' => 'patient',
            'appointment_date' => 'date du rendez-vous',
            'reason' => 'raison',
            'notes' => 'notes',
            'status' => 'statut',
            'duration' => 'durée',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('appointment_date')) {
            $this->merge([
                'appointment_date' => Carbon::parse($this->appointment_date)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
