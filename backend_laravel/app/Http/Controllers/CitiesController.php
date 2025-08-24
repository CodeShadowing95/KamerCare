<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class CitiesController extends Controller
{
    /**
     * Récupère les villes d'une région spécifique
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCitiesByRegion(Request $request): JsonResponse
    {
        try {
            // Validation de la région
            $request->validate([
                'region' => 'required|string|max:255'
            ]);

            $region = $request->input('region');
            
            // Chemin vers le fichier JSON
            $jsonPath = base_path('villes_par_region.json');
            
            // Vérifier si le fichier existe
            if (!File::exists($jsonPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier des villes non trouvé',
                    'data' => []
                ], 404);
            }

            // Lire le contenu du fichier JSON
            $jsonContent = File::get($jsonPath);
            $citiesData = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la lecture du fichier JSON',
                    'data' => []
                ], 500);
            }

            // Rechercher la région (insensible à la casse)
            $regionKey = null;
            foreach (array_keys($citiesData) as $key) {
                if (strtolower($key) === strtolower($region)) {
                    $regionKey = $key;
                    break;
                }
            }

            if ($regionKey === null) {
                return response()->json([
                    'success' => false,
                    'message' => "Région '{$region}' non trouvée",
                    'data' => [],
                    'available_regions' => array_keys($citiesData)
                ], 404);
            }

            $cities = $citiesData[$regionKey];

            return response()->json([
                'success' => true,
                'message' => "Villes de la région {$regionKey} récupérées avec succès",
                'data' => [
                    'region' => $regionKey,
                    'cities_count' => count($cities),
                    'cities' => $cities
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des villes: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'data' => []
            ], 500);
        }
    }

    /**
     * Récupère toutes les régions disponibles
     *
     * @return JsonResponse
     */
    public function getRegions(): JsonResponse
    {
        try {
            // Chemin vers le fichier JSON
            $jsonPath = base_path('villes_par_region.json');
            
            // Vérifier si le fichier existe
            if (!File::exists($jsonPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier des villes non trouvé',
                    'data' => []
                ], 404);
            }

            // Lire le contenu du fichier JSON
            $jsonContent = File::get($jsonPath);
            $citiesData = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la lecture du fichier JSON',
                    'data' => []
                ], 500);
            }

            $regions = array_keys($citiesData);
            $regionsWithCount = [];

            foreach ($regions as $region) {
                $regionsWithCount[] = [
                    'name' => $region,
                    'cities_count' => count($citiesData[$region])
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Régions récupérées avec succès',
                'data' => [
                    'regions_count' => count($regions),
                    'regions' => $regionsWithCount
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des régions: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'data' => []
            ], 500);
        }
    }

    /**
     * Recherche des villes par nom dans toutes les régions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchCities(Request $request): JsonResponse
    {
        try {
            // Validation du terme de recherche
            $request->validate([
                'search' => 'required|string|min:2|max:255'
            ]);

            $searchTerm = strtolower($request->input('search'));
            
            // Chemin vers le fichier JSON
            $jsonPath = base_path('villes_par_region.json');
            
            // Vérifier si le fichier existe
            if (!File::exists($jsonPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fichier des villes non trouvé',
                    'data' => []
                ], 404);
            }

            // Lire le contenu du fichier JSON
            $jsonContent = File::get($jsonPath);
            $citiesData = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la lecture du fichier JSON',
                    'data' => []
                ], 500);
            }

            $results = [];

            foreach ($citiesData as $region => $cities) {
                foreach ($cities as $city) {
                    if (strpos(strtolower($city['city']), $searchTerm) !== false) {
                        $results[] = [
                            'city' => $city['city'],
                            'region' => $region,
                            'lat' => $city['lat'],
                            'lng' => $city['lng']
                        ];
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => count($results) > 0 ? 
                    "Trouvé " . count($results) . " ville(s) correspondant à '{$request->input('search')}'" :
                    "Aucune ville trouvée pour '{$request->input('search')}'",
                'data' => [
                    'search_term' => $request->input('search'),
                    'results_count' => count($results),
                    'cities' => $results
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la recherche des villes: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur',
                'data' => []
            ], 500);
        }
    }
}