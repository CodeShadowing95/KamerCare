<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHospitalRequest;
use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HospitalController extends Controller
{
    /**
     * Store a newly created hospital in storage.
     */
    public function store(StoreHospitalRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Créer l'hôpital avec les données validées
            $hospital = Hospital::create([
                'nom' => $request->nom,
                'type' => $request->type,
                'adresse' => $request->adresse,
                'ville' => $request->ville,
                'telephone' => $request->telephone,
                'email' => $request->email,
                'photo' => $request->photo,
            ]);

            DB::commit();

            Log::info('Nouvel hôpital créé', [
                'hospital_id' => $hospital->id,
                'nom' => $hospital->nom,
                'ville' => $hospital->ville
            ]);

            return response()->json([
                'success' => true,
                'data' => $hospital,
                'message' => 'Hôpital créé avec succès'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Erreur lors de la création de l\'hôpital', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'hôpital: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of hospitals.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Hospital::query();

            // Search functionality
            if ($request->has('search') && !empty($request->get('search'))) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('ville', 'like', "%{$search}%")
                      ->orWhere('adresse', 'like', "%{$search}%");
                });
            }

            // Filter by city
            if ($request->has('ville') && !empty($request->get('ville'))) {
                $query->inCity($request->get('ville'));
            }

            // Order by name
            $query->orderBy('nom', 'asc');

            // Pagination
            $perPage = $request->get('per_page', 50);
            $hospitals = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $hospitals,
                'message' => 'Hôpitaux récupérés avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des hôpitaux: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified hospital.
     */
    public function show(Hospital $hospital): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $hospital->load('doctors'),
                'message' => 'Hôpital récupéré avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'hôpital: ' . $e->getMessage()
            ], 500);
        }
    }
}