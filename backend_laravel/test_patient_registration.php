<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;

echo "=== Test d'inscription d'un patient ===\n";

// Supprimer l'utilisateur de test s'il existe déjà
$existingUser = User::where('email', 'jean.patient@test.com')->first();
if ($existingUser) {
    // Supprimer le patient associé s'il existe
    $existingPatient = Patient::where('user_id', $existingUser->id)->first();
    if ($existingPatient) {
        $existingPatient->delete();
        echo "Patient existant supprimé\n";
    }
    $existingUser->delete();
    echo "Utilisateur existant supprimé\n";
}

echo "\n=== Création d'un nouvel utilisateur patient ===\n";

// Créer un utilisateur patient
$user = User::create([
    'name' => 'Jean Patient',
    'email' => 'jean.patient@test.com',
    'password' => Hash::make('password123'),
    'role' => 'patient',
    'phone' => '+237123456789',
    'is_active' => true,
]);

echo "✓ Utilisateur créé avec succès (ID: {$user->id})\n";
echo "  - Nom: {$user->name}\n";
echo "  - Email: {$user->email}\n";
echo "  - Rôle: {$user->role}\n";
echo "  - Téléphone: {$user->phone}\n";

// Créer automatiquement le patient (comme dans le contrôleur)
$nameParts = explode(' ', $user->name, 2);
$firstName = $nameParts[0];
$lastName = isset($nameParts[1]) ? $nameParts[1] : '';

$patient = Patient::create([
    'user_id' => $user->id,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => $user->email,
    'phone' => $user->phone,
    'date_of_birth' => '1990-01-01', // Date par défaut
    'gender' => 'male', // Genre par défaut
]);

echo "\n✓ Patient créé automatiquement (ID: {$patient->id})\n";
echo "  - Prénom: {$patient->first_name}\n";
echo "  - Nom: {$patient->last_name}\n";
echo "  - Email: {$patient->email}\n";
echo "  - Téléphone: {$patient->phone}\n";
echo "  - User ID: {$patient->user_id}\n";
echo "  - Créé le: {$patient->created_at}\n";

// Vérifier la relation
$userWithPatient = User::with('patient')->find($user->id);
if ($userWithPatient && $userWithPatient->patient) {
    echo "\n✓ Relation User -> Patient fonctionne\n";
} else {
    echo "\n✗ Erreur: Relation User -> Patient ne fonctionne pas\n";
}

$patientWithUser = Patient::with('user')->find($patient->id);
if ($patientWithUser && $patientWithUser->user) {
    echo "✓ Relation Patient -> User fonctionne\n";
} else {
    echo "✗ Erreur: Relation Patient -> User ne fonctionne pas\n";
}

echo "\n=== Statistiques finales ===\n";
echo "Nombre total d'utilisateurs: " . User::count() . "\n";
echo "Nombre total de patients: " . Patient::count() . "\n";
echo "Nombre de patients avec user_id: " . Patient::whereNotNull('user_id')->count() . "\n";

echo "\n=== Test terminé avec succès ===\n";