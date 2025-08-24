<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Patient::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by gender
        if ($request->has('gender')) {
            $query->where('gender', $request->get('gender'));
        }

        // Filter by blood type
        if ($request->has('blood_type')) {
            $query->where('blood_type', $request->get('blood_type'));
        }

        $patients = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $patients,
            'message' => 'Patients retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'blood_type' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'insurance_number' => 'nullable|string|max:100'
        ]);

        $patient = Patient::create($validated);

        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Patient created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient): JsonResponse
    {
        $patient->load(['appointments.doctor', 'medicalRecords.doctor']);

        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Patient retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('patients')->ignore($patient->id)],
            'phone' => 'sometimes|required|string|max:20',
            'date_of_birth' => 'sometimes|required|date|before:today',
            'gender' => 'sometimes|required|in:male,female,other',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'blood_type' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'insurance_number' => 'nullable|string|max:100'
        ]);

        $patient->update($validated);

        return response()->json([
            'success' => true,
            'data' => $patient->fresh(),
            'message' => 'Patient updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient): JsonResponse
    {
        // Check if patient has appointments
        if ($patient->appointments()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete patient with existing appointments'
            ], 422);
        }

        $patient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patient deleted successfully'
        ]);
    }

    /**
     * Get patient's appointments
     */
    public function appointments(Patient $patient): JsonResponse
    {
        $appointments = $patient->appointments()
            ->with('doctor')
            ->orderBy('appointment_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $appointments,
            'message' => 'Patient appointments retrieved successfully'
        ]);
    }

    /**
     * Get patient's medical records
     */
    public function medicalRecords(Patient $patient): JsonResponse
    {
        $records = $patient->medicalRecords()
            ->with(['doctor', 'appointment'])
            ->orderBy('visit_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Patient medical records retrieved successfully'
        ]);
    }
}
