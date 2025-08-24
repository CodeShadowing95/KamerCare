<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can create appointments
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date|after:now',
            'appointment_time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:15|max:180',
            'type' => ['required', Rule::in(['consultation', 'follow_up', 'emergency', 'surgery', 'checkup'])],
            'reason' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'status' => ['sometimes', Rule::in(['scheduled', 'confirmed', 'cancelled', 'completed', 'no_show'])]
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check if appointment time is during business hours (8 AM to 6 PM)
            if ($this->appointment_time) {
                $time = Carbon::createFromFormat('H:i', $this->appointment_time);
                if ($time->hour < 8 || $time->hour >= 18) {
                    $validator->errors()->add('appointment_time', 'Les rendez-vous doivent être programmés entre 8h00 et 18h00.');
                }
            }

            // Check if appointment is not on weekend (optional business rule)
            if ($this->appointment_date) {
                $date = Carbon::parse($this->appointment_date);
                if ($date->isWeekend()) {
                    $validator->errors()->add('appointment_date', 'Les rendez-vous ne peuvent pas être programmés le week-end.');
                }
            }

            // Validate appointment datetime combination
            if ($this->appointment_date && $this->appointment_time) {
                $appointmentDateTime = Carbon::parse($this->appointment_date . ' ' . $this->appointment_time);
                
                // Check if appointment is at least 1 hour in the future
                if ($appointmentDateTime->lessThan(Carbon::now()->addHour())) {
                    $validator->errors()->add('appointment_date', 'Le rendez-vous doit être programmé au moins 1 heure à l\'avance.');
                }

                // Check if appointment is not more than 3 months in the future
                if ($appointmentDateTime->greaterThan(Carbon::now()->addMonths(3))) {
                    $validator->errors()->add('appointment_date', 'Le rendez-vous ne peut pas être programmé plus de 3 mois à l\'avance.');
                }
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'Le patient est obligatoire.',
            'patient_id.exists' => 'Le patient sélectionné n\'existe pas.',
            'doctor_id.required' => 'Le docteur est obligatoire.',
            'doctor_id.exists' => 'Le docteur sélectionné n\'existe pas.',
            'appointment_date.required' => 'La date du rendez-vous est obligatoire.',
            'appointment_date.date' => 'La date du rendez-vous doit être une date valide.',
            'appointment_date.after' => 'La date du rendez-vous doit être dans le futur.',
            'appointment_time.required' => 'L\'heure du rendez-vous est obligatoire.',
            'appointment_time.date_format' => 'L\'heure du rendez-vous doit être au format HH:MM.',
            'duration.required' => 'La durée du rendez-vous est obligatoire.',
            'duration.integer' => 'La durée doit être un nombre entier.',
            'duration.min' => 'La durée minimale est de 15 minutes.',
            'duration.max' => 'La durée maximale est de 180 minutes.',
            'type.required' => 'Le type de rendez-vous est obligatoire.',
            'type.in' => 'Le type de rendez-vous doit être: consultation, suivi, urgence, chirurgie ou contrôle.',
            'reason.required' => 'La raison du rendez-vous est obligatoire.',
            'reason.max' => 'La raison ne peut pas dépasser 500 caractères.',
            'notes.max' => 'Les notes ne peuvent pas dépasser 1000 caractères.',
            'priority.required' => 'La priorité est obligatoire.',
            'priority.in' => 'La priorité doit être: faible, moyenne, élevée ou urgente.',
            'status.in' => 'Le statut doit être: programmé, confirmé, annulé, terminé ou absent.'
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'patient_id' => 'patient',
            'doctor_id' => 'docteur',
            'appointment_date' => 'date du rendez-vous',
            'appointment_time' => 'heure du rendez-vous',
            'duration' => 'durée',
            'type' => 'type de rendez-vous',
            'reason' => 'raison',
            'notes' => 'notes',
            'priority' => 'priorité',
            'status' => 'statut'
        ];
    }
}
