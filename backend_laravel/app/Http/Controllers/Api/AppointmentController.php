<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient', 'doctor', 'createdBy']);

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->get('patient_id'));
        }

        // Filter by doctor
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->get('doctor_id'));
        }

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->get('status'));
        }

        // Filter by appointment type
        if ($request->has('appointment_type')) {
            $query->byType($request->get('appointment_type'));
        }

        // Filter for visio appointments
        if ($request->has('visio') && filter_var($request->get('visio'), FILTER_VALIDATE_BOOLEAN)) {
            $query->visio();
        }

        // Filter for presentiel appointments
        if ($request->has('presentiel') && filter_var($request->get('presentiel'), FILTER_VALIDATE_BOOLEAN)) {
            $query->presentiel();
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('appointment_date', '>=', $request->get('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('appointment_date', '<=', $request->get('end_date'));
        }

        // Filter for today's appointments
        if ($request->has('today') && filter_var($request->get('today'), FILTER_VALIDATE_BOOLEAN)) {
            $query->today();
        }

        // Filter for upcoming appointments
        if ($request->has('upcoming') && filter_var($request->get('upcoming'), FILTER_VALIDATE_BOOLEAN)) {
            $query->upcoming();
        }

        $appointments = $query->orderBy('appointment_date', 'asc')
                             ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $appointments,
            'message' => 'Appointments retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:users,id', // ID de l'utilisateur patient
            'doctor_id' => 'required|exists:doctors,id', // ID du profil docteur
            'appointment_date' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:15|max:240',
            'appointment_type' => 'required|in:presentiel,visio,domicile,urgence,suivi',
            'reason_for_visit' => 'required|string|max:500',
            'notes' => 'nullable|string',
            'consultation_fee' => 'required|numeric|min:0',
            'created_by_user_id' => 'required|exists:users,id' // ID de l'utilisateur qui crée le RDV
        ]);

        // Récupérer l'utilisateur patient
        $user = \App\Models\User::findOrFail($validated['patient_id']);
        
        // Vérifier que l'utilisateur a le rôle patient
        if ($user->role !== 'patient') {
            return response()->json([
                'success' => false,
                'message' => 'L\'utilisateur sélectionné n\'est pas un patient'
            ], 422);
        }

        // Créer ou récupérer l'enregistrement patient
        $patient = Patient::firstOrCreate(
            ['email' => $user->email], // Utiliser l'email comme critère principal
            [
                'user_id' => $user->id,
                'first_name' => explode(' ', $user->name)[0] ?? $user->name,
                'last_name' => explode(' ', $user->name, 2)[1] ?? '',
                'phone' => $user->phone,
                'date_of_birth' => '1990-01-01', // Date par défaut, à mettre à jour par le patient
            ]
        );

        // Récupérer le profil docteur directement
        $doctor = Doctor::findOrFail($validated['doctor_id']);
        
        // Vérifier que le docteur a un utilisateur associé avec le rôle docteur
        if (!$doctor->user || $doctor->user->role !== 'doctor') {
            return response()->json([
                'success' => false,
                'message' => 'L\'utilisateur sélectionné n\'est pas un docteur'
            ], 422);
        }

        // Créer la relation doctor_patient si elle n'existe pas
        if (!$patient->doctors()->where('doctor_id', $doctor->id)->exists()) {
            $patient->doctors()->attach($doctor->id, [
                'assigned_at' => now(),
                'is_active' => true,
                'notes' => 'Assigné automatiquement lors de la création du rendez-vous'
            ]);
        }

        // Check if doctor is available at the requested time
        $appointmentDate = Carbon::parse($validated['appointment_date']);
        $endTime = $appointmentDate->copy()->addMinutes($validated['duration_minutes']);

        $conflictingAppointment = Appointment::where('doctor_id', $doctor->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($appointmentDate, $endTime) {
                $query->whereBetween('appointment_date', [$appointmentDate, $endTime])
                      ->orWhere(function ($q) use ($appointmentDate, $endTime) {
                          $q->where('appointment_date', '<=', $appointmentDate)
                            ->whereRaw('DATE_ADD(appointment_date, INTERVAL duration_minutes MINUTE) > ?', [$appointmentDate]);
                      });
            })
            ->exists();

        if ($conflictingAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor is not available at the requested time'
            ], 422);
        }

        // Créer le rendez-vous avec l'ID du patient créé
        $appointmentData = $validated;
        $appointmentData['patient_id'] = $patient->id; // Utiliser l'ID du patient créé
        $appointmentData['doctor_id'] = $doctor->id; // Utiliser l'ID du docteur récupéré
        // Utiliser le created_by_user_id envoyé dans la requête (obligatoire)
        $appointmentData['created_by_user_id'] = $validated['created_by_user_id'];
        
        // Déterminer le statut selon qui crée le rendez-vous
        $createdByUser = \App\Models\User::findOrFail($validated['created_by_user_id']);
        $appointmentData['status'] = $createdByUser->role === 'doctor' ? 'scheduled' : 'requested';
        $appointmentData['payment_status'] = 'pending';
        
        $appointment = Appointment::create($appointmentData);
        $appointment->load(['patient', 'doctor', 'createdBy']);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Appointment created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['patient', 'doctor', 'medicalRecord', 'createdBy']);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Appointment retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validated = $request->validate([
            'appointment_date' => 'sometimes|required|date|after:now',
            'duration_minutes' => 'sometimes|required|integer|min:15|max:240',
            'appointment_type' => 'sometimes|required|in:presentiel,visio,domicile,urgence,suivi',
            'reason_for_visit' => 'sometimes|required|string|max:500',
            'notes' => 'nullable|string',
            'consultation_fee' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:scheduled,confirmed,completed,cancelled,no_show',
            'payment_status' => 'sometimes|required|in:pending,paid,refunded'
        ]);

        // If updating appointment date or duration, check for conflicts
        if (isset($validated['appointment_date']) || isset($validated['duration_minutes'])) {
            $appointmentDate = Carbon::parse($validated['appointment_date'] ?? $appointment->appointment_date);
            $duration = $validated['duration_minutes'] ?? $appointment->duration_minutes;
            $endTime = $appointmentDate->copy()->addMinutes($duration);

            $conflictingAppointment = Appointment::where('doctor_id', $appointment->doctor_id)
                ->where('id', '!=', $appointment->id)
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($appointmentDate, $endTime) {
                    $query->whereBetween('appointment_date', [$appointmentDate, $endTime])
                          ->orWhere(function ($q) use ($appointmentDate, $endTime) {
                              $q->where('appointment_date', '<=', $appointmentDate)
                                ->whereRaw('DATE_ADD(appointment_date, INTERVAL duration_minutes MINUTE) > ?', [$appointmentDate]);
                          });
                })
                ->exists();

            if ($conflictingAppointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor is not available at the requested time'
                ], 422);
            }
        }

        $appointment->update($validated);

        return response()->json([
            'success' => true,
            'data' => $appointment->fresh(['patient', 'doctor']),
            'message' => 'Appointment updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        // Check if appointment has medical records
        if ($appointment->medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete appointment with medical records'
            ], 422);
        }

        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }

    /**
     * Confirm an appointment
     */
    public function confirm(Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'scheduled') {
            return response()->json([
                'success' => false,
                'message' => 'Only scheduled appointments can be confirmed'
            ], 422);
        }

        $appointment->confirm();

        return response()->json([
            'success' => true,
            'data' => $appointment->fresh(),
            'message' => 'Appointment confirmed successfully'
        ]);
    }

    /**
     * Cancel an appointment
     */
    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500'
        ]);

        if (in_array($appointment->status, ['completed', 'cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel completed or already cancelled appointments'
            ], 422);
        }

        $appointment->cancel($validated['cancellation_reason']);

        return response()->json([
            'success' => true,
            'data' => $appointment->fresh(),
            'message' => 'Appointment cancelled successfully'
        ]);
    }

    /**
     * Mark appointment as completed
     */
    public function complete(Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'confirmed') {
            return response()->json([
                'success' => false,
                'message' => 'Only confirmed appointments can be marked as completed'
            ], 422);
        }

        $appointment->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'data' => $appointment->fresh(),
            'message' => 'Appointment marked as completed'
        ]);
    }

    /**
     * Get available time slots for a doctor on a specific date
     */
    public function availableSlots(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date|after_or_equal:today'
        ]);

        $doctor = Doctor::findOrFail($validated['doctor_id']);
        $date = Carbon::parse($validated['date']);

        // Get existing appointments for the doctor on this date
        $existingAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->get(['appointment_date', 'duration_minutes']);

        // Generate available slots (assuming 9 AM to 5 PM, 30-minute slots)
        $startTime = $date->copy()->setTime(9, 0);
        $endTime = $date->copy()->setTime(17, 0);
        $slotDuration = 30; // minutes
        $availableSlots = [];

        while ($startTime->lt($endTime)) {
            $slotEnd = $startTime->copy()->addMinutes($slotDuration);
            
            // Check if this slot conflicts with existing appointments
            $hasConflict = $existingAppointments->contains(function ($appointment) use ($startTime, $slotEnd) {
                $appointmentStart = Carbon::parse($appointment->appointment_date);
                $appointmentEnd = $appointmentStart->copy()->addMinutes($appointment->duration_minutes);
                
                return $startTime->lt($appointmentEnd) && $slotEnd->gt($appointmentStart);
            });

            if (!$hasConflict) {
                $availableSlots[] = [
                    'start_time' => $startTime->format('H:i'),
                    'end_time' => $slotEnd->format('H:i'),
                    'datetime' => $startTime->toISOString()
                ];
            }

            $startTime->addMinutes($slotDuration);
        }

        return response()->json([
            'success' => true,
            'data' => $availableSlots,
            'message' => 'Available slots retrieved successfully'
        ]);
    }

    /**
     * Get available appointment types
     */
    public function getAppointmentTypes(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'types' => Appointment::APPOINTMENT_TYPES,
                'constants' => [
                    'TYPE_PRESENTIEL' => Appointment::TYPE_PRESENTIEL,
                    'TYPE_VISIO' => Appointment::TYPE_VISIO,
                    'TYPE_DOMICILE' => Appointment::TYPE_DOMICILE,
                    'TYPE_URGENCE' => Appointment::TYPE_URGENCE,
                    'TYPE_SUIVI' => Appointment::TYPE_SUIVI,
                ]
            ],
            'message' => 'Appointment types retrieved successfully'
        ]);
    }
}
