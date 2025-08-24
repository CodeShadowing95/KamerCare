<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MedicalRecord::with(['patient', 'doctor', 'appointment']);

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->byPatient($request->get('patient_id'));
        }

        // Filter by doctor
        if ($request->has('doctor_id')) {
            $query->byDoctor($request->get('doctor_id'));
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('visit_date', '>=', $request->get('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('visit_date', '<=', $request->get('end_date'));
        }

        // Filter for recent records
        if ($request->has('recent') && filter_var($request->get('recent'), FILTER_VALIDATE_BOOLEAN)) {
            $query->recent();
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('chief_complaint', 'like', "%{$search}%")
                  ->orWhere('diagnosis', 'like', "%{$search}%")
                  ->orWhere('treatment_plan', 'like', "%{$search}%")
                  ->orWhere('medications_prescribed', 'like', "%{$search}%");
            });
        }

        $records = $query->orderBy('visit_date', 'desc')
                        ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Medical records retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'visit_date' => 'required|date',
            'chief_complaint' => 'required|string|max:500',
            'history_of_present_illness' => 'nullable|string',
            'physical_examination' => 'nullable|string',
            'vital_signs' => 'nullable|json',
            'diagnosis' => 'required|string',
            'treatment_plan' => 'required|string',
            'medications_prescribed' => 'nullable|string',
            'lab_tests_ordered' => 'nullable|string',
            'follow_up_instructions' => 'nullable|string',
            'next_appointment_date' => 'nullable|date|after:visit_date',
            'doctor_notes' => 'nullable|string',
            'attachments' => 'nullable|array'
        ]);

        // If appointment_id is provided, verify it belongs to the patient and doctor
        if (isset($validated['appointment_id'])) {
            $appointment = Appointment::where('id', $validated['appointment_id'])
                ->where('patient_id', $validated['patient_id'])
                ->where('doctor_id', $validated['doctor_id'])
                ->first();

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid appointment for the specified patient and doctor'
                ], 422);
            }

            // Mark appointment as completed if not already
            if ($appointment->status !== 'completed') {
                $appointment->update(['status' => 'completed']);
            }
        }

        $record = MedicalRecord::create($validated);
        $record->load(['patient', 'doctor', 'appointment']);

        return response()->json([
            'success' => true,
            'data' => $record,
            'message' => 'Medical record created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicalRecord $medicalRecord): JsonResponse
    {
        $medicalRecord->load(['patient', 'doctor', 'appointment']);

        return response()->json([
            'success' => true,
            'data' => $medicalRecord,
            'message' => 'Medical record retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $validated = $request->validate([
            'visit_date' => 'sometimes|required|date',
            'chief_complaint' => 'sometimes|required|string|max:500',
            'history_of_present_illness' => 'nullable|string',
            'physical_examination' => 'nullable|string',
            'vital_signs' => 'nullable|json',
            'diagnosis' => 'sometimes|required|string',
            'treatment_plan' => 'sometimes|required|string',
            'medications_prescribed' => 'nullable|string',
            'lab_tests_ordered' => 'nullable|string',
            'follow_up_instructions' => 'nullable|string',
            'next_appointment_date' => 'nullable|date|after:visit_date',
            'doctor_notes' => 'nullable|string',
            'attachments' => 'nullable|array'
        ]);

        $medicalRecord->update($validated);

        return response()->json([
            'success' => true,
            'data' => $medicalRecord->fresh(['patient', 'doctor', 'appointment']),
            'message' => 'Medical record updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRecord $medicalRecord): JsonResponse
    {
        $medicalRecord->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medical record deleted successfully'
        ]);
    }

    /**
     * Add attachment to medical record
     */
    public function addAttachment(Request $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $validated = $request->validate([
            'file_name' => 'required|string|max:255',
            'file_path' => 'required|string|max:500',
            'file_type' => 'required|string|max:50',
            'file_size' => 'required|integer|min:1'
        ]);

        $medicalRecord->addAttachment($validated['file_name'], $validated['file_path']);

        return response()->json([
            'success' => true,
            'data' => $medicalRecord->fresh(),
            'message' => 'Attachment added successfully'
        ]);
    }

    /**
     * Get patient's medical history
     */
    public function patientHistory(Patient $patient): JsonResponse
    {
        $records = $patient->medicalRecords()
            ->with(['doctor', 'appointment'])
            ->orderBy('visit_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Patient medical history retrieved successfully'
        ]);
    }

    /**
     * Get doctor's patient records
     */
    public function doctorRecords(Doctor $doctor): JsonResponse
    {
        $records = $doctor->medicalRecords()
            ->with(['patient', 'appointment'])
            ->orderBy('visit_date', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Doctor medical records retrieved successfully'
        ]);
    }

    /**
     * Generate medical report for a patient
     */
    public function generateReport(Patient $patient, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'include_attachments' => 'boolean'
        ]);

        $query = $patient->medicalRecords()->with(['doctor', 'appointment']);

        if (isset($validated['start_date'])) {
            $query->where('visit_date', '>=', $validated['start_date']);
        }

        if (isset($validated['end_date'])) {
            $query->where('visit_date', '<=', $validated['end_date']);
        }

        $records = $query->orderBy('visit_date', 'desc')->get();

        $report = [
            'patient' => $patient,
            'records' => $records,
            'summary' => [
                'total_visits' => $records->count(),
                'date_range' => [
                    'from' => $validated['start_date'] ?? ($records->last() ? $records->last()->visit_date : null),
                    'to' => $validated['end_date'] ?? ($records->first() ? $records->first()->visit_date : null)
                ],
                'common_diagnoses' => $records->pluck('diagnosis')
                    ->filter()
                    ->countBy()
                    ->sortDesc()
                    ->take(5),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $report,
            'message' => 'Medical report generated successfully'
        ]);
    }
}
