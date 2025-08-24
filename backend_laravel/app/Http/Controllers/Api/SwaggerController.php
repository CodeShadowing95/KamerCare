<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

/**
 * @OA\Info(
 *     title="Cameroon Medical Platform API",
 *     version="1.0.0",
 *     description="API pour la plateforme médicale du Cameroun permettant la gestion des patients, docteurs, rendez-vous et dossiers médicaux.",
 *     @OA\Contact(
 *         email="admin@cameroon-medical.com",
 *         name="Support API"
 *     )
 * )
 *
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Serveur de développement local"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Authentification via Laravel Sanctum"
 * )
 *
 * @OA\Tag(
 *     name="Authentication",
 *     description="Endpoints d'authentification"
 * )
 *
 * @OA\Tag(
 *     name="Patients",
 *     description="Gestion des patients"
 * )
 *
 * @OA\Tag(
 *     name="Doctors",
 *     description="Gestion des docteurs"
 * )
 *
 * @OA\Tag(
 *     name="Appointments",
 *     description="Gestion des rendez-vous"
 * )
 *
 * @OA\Tag(
 *     name="Medical Records",
 *     description="Gestion des dossiers médicaux"
 * )
 *
 * @OA\Tag(
 *     name="Public",
 *     description="Endpoints publics"
 * )
 */
class SwaggerController extends Controller
{
    // Ce contrôleur sert uniquement pour les annotations Swagger globales
}