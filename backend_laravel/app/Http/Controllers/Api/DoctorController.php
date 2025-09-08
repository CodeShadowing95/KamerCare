<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::with('user');

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%")
                  ->orWhere('license_number', 'like', "%{$search}%");
            });
        }

        // Filter by specialization
        if ($request->has('specialization')) {
            $query->bySpecialization($request->get('specialization'));
        }

        // Filter by availability
        if ($request->has('available')) {
            $available = filter_var($request->get('available'), FILTER_VALIDATE_BOOLEAN);
            if ($available) {
                $query->available();
            }
        }

        $doctors = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $doctors,
            'message' => 'Doctors retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'specialization' => 'required|array|min:1',
            'specialization.*' => 'required|string|max:255',
            'hospital' => 'nullable|string|max:255',
            'license_number' => 'required|string|unique:doctors,license_number',
            'phone' => 'required|string|max:20',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|array',
            'education' => 'nullable|array',
            'certifications' => 'nullable|array',
            'references' => 'nullable|array',
            'years_of_experience' => 'required|string',
            'office_address' => 'nullable|string',
            'consultation_hours' => 'nullable|array',
            'consultation_fee' => 'required|numeric|min:0',
            'is_available' => 'boolean'
        ]);

        // Create user account for doctor
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'doctor',
            'phone' => $validated['phone'],
            'is_active' => true
        ]);

        // Create doctor profile
        $doctorData = collect($validated)->except(['email', 'password'])->toArray();
        $doctorData['user_id'] = $user->id;
        $doctorData['is_certified'] = 'No'; // Valeur par défaut
        
        $doctor = Doctor::create($doctorData);
        $doctor->load('user');

        return response()->json([
            'success' => true,
            'data' => $doctor,
            'message' => 'Doctor created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor): JsonResponse
    {
        $doctor->load(['user', 'appointments.patient', 'medicalRecords.patient']);

        return response()->json([
            'success' => true,
            'data' => $doctor,
            'message' => 'Doctor retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'email' => ['nullable', 'email', Rule::unique('doctors')->ignore($doctor->id)],
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'specialization' => 'sometimes|required|array|min:1',
            'specialization.*' => 'required|string|max:255',
            'hospital' => 'nullable|string|max:255',
            'license_number' => ['sometimes', 'required', 'string', Rule::unique('doctors')->ignore($doctor->id)],
            'phone' => 'sometimes|required|string|max:20',
            'bio' => 'nullable|string',
            'qualifications' => 'nullable|array',
            'education' => 'nullable|array',
            'certifications' => 'nullable|array',
            'references' => 'nullable|array',
            'years_of_experience' => 'sometimes|required|string',
            'office_address' => 'nullable|string',
            'consultation_hours' => 'nullable|array',
            'consultation_fee' => 'sometimes|required|numeric|min:0',
            'is_available' => 'boolean'
        ]);

        $doctor->update($validated);

        // Update user name if first_name or last_name changed
        if (isset($validated['first_name']) || isset($validated['last_name'])) {
            $doctor->user->update([
                'name' => ($validated['first_name'] ?? $doctor->first_name) . ' ' . ($validated['last_name'] ?? $doctor->last_name)
            ]);
        }

        // Update user phone if changed
        if (isset($validated['phone'])) {
            $doctor->user->update(['phone' => $validated['phone']]);
        }

        // Update user email if changed
        if (isset($validated['email'])) {
            $doctor->user->update(['email' => $validated['email']]);
        }

        return response()->json([
            'success' => true,
            'data' => $doctor->fresh(['user']),
            'message' => 'Doctor updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor): JsonResponse
    {
        // Check if doctor has appointments
        if ($doctor->appointments()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete doctor with existing appointments'
            ], 422);
        }

        // Delete associated user account
        $doctor->user->delete();
        $doctor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Doctor deleted successfully'
        ]);
    }

    /**
     * Get doctor's appointments
     */
    public function appointments(Doctor $doctor): JsonResponse
    {
        $appointments = $doctor->appointments()
            ->with('patient')
            ->orderBy('appointment_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $appointments,
            'message' => 'Doctor appointments retrieved successfully'
        ]);
    }

    /**
     * Get doctor's medical records
     */
    public function medicalRecords(Doctor $doctor): JsonResponse
    {
        $records = $doctor->medicalRecords()
            ->with(['patient', 'appointment'])
            ->orderBy('visit_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Doctor medical records retrieved successfully'
        ]);
    }

    /**
     * Toggle doctor availability
     */
    public function toggleAvailability(Doctor $doctor): JsonResponse
    {
        $doctor->update(['is_available' => !$doctor->is_available]);

        return response()->json([
            'success' => true,
            'data' => $doctor->fresh(),
            'message' => 'Doctor availability updated successfully'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/public/specializations",
     *     tags={"Public"},
     *     summary="Obtenir les spécialisations disponibles",
     *     description="Récupérer la liste de toutes les spécialisations médicales disponibles",
     *     @OA\Response(
     *         response=200,
     *         description="Liste des spécialisations récupérée avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Specializations retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(type="string", example="Cardiologie")
     *             )
     *         )
     *     )
     * )
     */
    public function specializations(): JsonResponse
    {
        $specializations = Doctor::distinct('specialization')
            ->pluck('specialization')
            ->filter()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $specializations,
            'message' => 'Specializations retrieved successfully'
        ]);
    }
}
