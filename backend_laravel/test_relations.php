<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use App\Models\Doctor;
use App\Models\Patient;

// Test des relations doctor-patient
echo "=== Test des relations Doctor-Patient ===\n\n";

// Récupérer le premier docteur
$doctor = Doctor::first();
if (!$doctor) {
    echo "Aucun docteur trouvé dans la base de données.\n";
    exit;
}

echo "Docteur: {$doctor->full_name}\n";
echo "Nombre de patients assignés: " . $doctor->patients()->count() . "\n\n";

// Lister les patients du docteur
echo "Patients assignés:\n";
$doctor->patients()->each(function($patient) {
    echo "- {$patient->full_name} (Email: {$patient->email})\n";
});

echo "\n=== Test de la table pivot ===\n";
// Vérifier les données de la table pivot
$patientWithPivot = $doctor->patients()->first();
if ($patientWithPivot) {
    echo "Premier patient: {$patientWithPivot->full_name}\n";
    echo "Date d'assignation: {$patientWithPivot->pivot->assigned_at}\n";
    echo "Notes: {$patientWithPivot->pivot->notes}\n";
    echo "Actif: " . ($patientWithPivot->pivot->is_active ? 'Oui' : 'Non') . "\n";
}

echo "\n=== Test terminé ===\n";