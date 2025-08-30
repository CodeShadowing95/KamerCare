<?php

require_once 'vendor/autoload.php';

// Configuration de base
$baseUrl = 'http://localhost:8000/api';

// Fonction pour faire des requêtes cURL
function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'body' => json_decode($response, true)
    ];
}

echo "=== Test de création de rendez-vous ===\n\n";

// 1. Connexion du docteur
echo "1. Connexion du docteur...\n";
$loginResponse = makeRequest($baseUrl . '/login', 'POST', [
    'email' => 'test.doctor@example.com',
    'password' => 'password123'
], [
    'Content-Type: application/json',
    'Accept: application/json'
]);

if ($loginResponse['status'] !== 200) {
    echo "Erreur de connexion: " . json_encode($loginResponse['body']) . "\n";
    exit(1);
}

$token = $loginResponse['body']['data']['token'];
$doctorUser = $loginResponse['body']['data']['user'];
echo "Connexion réussie. Token obtenu.\n";
echo "Docteur connecté: {$doctorUser['name']} (ID: {$doctorUser['id']})\n\n";

// 2. Récupération d'un patient de test
echo "2. Récupération des patients...\n";
$patientsResponse = makeRequest($baseUrl . '/patients/search?q=patient', 'GET', null, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);

if ($patientsResponse['status'] !== 200 || empty($patientsResponse['body']['data'])) {
    echo "Aucun patient trouvé. Utilisation du patient de test existant...\n";
    
    // Essayer de se connecter avec le patient de test existant
    $patientLoginResponse = makeRequest($baseUrl . '/login', 'POST', [
        'email' => 'test.patient@example.com',
        'password' => 'password123'
    ], [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($patientLoginResponse['status'] !== 200) {
        echo "Erreur: Impossible de se connecter avec le patient de test\n";
        exit(1);
    }
    
    $patientId = $patientLoginResponse['body']['data']['user']['id'];
    echo "Patient de test trouvé avec l'ID: {$patientId}\n";
} else {
    $patientId = $patientsResponse['body']['data'][0]['id'];
    echo "Patient trouvé avec l'ID: {$patientId}\n";
}

// 3. Création du rendez-vous
echo "\n3. Création du rendez-vous...\n";
$appointmentDate = date('Y-m-d H:i:s', strtotime('+1 day 10:00'));

$appointmentData = [
    'patient_id' => $patientId,
    'doctor_id' => $doctorUser['id'], // Utilisation de l'ID utilisateur du docteur
    'appointment_date' => $appointmentDate,
    'duration_minutes' => 30,
    'reason_for_visit' => 'Consultation de routine',
    'notes' => 'Test de création de rendez-vous',
    'consultation_fee' => 50.00
];

echo "Données envoyées: " . json_encode($appointmentData, JSON_PRETTY_PRINT) . "\n\n";

$appointmentResponse = makeRequest($baseUrl . '/appointments', 'POST', $appointmentData, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "Statut de la réponse: {$appointmentResponse['status']}\n";
echo "Réponse: " . json_encode($appointmentResponse['body'], JSON_PRETTY_PRINT) . "\n";

if ($appointmentResponse['status'] === 201) {
    echo "\n✅ Rendez-vous créé avec succès !\n";
    $appointment = $appointmentResponse['body']['data'];
    echo "ID du rendez-vous: {$appointment['id']}\n";
    echo "Patient: {$appointment['patient']['first_name']} {$appointment['patient']['last_name']}\n";
    echo "Docteur: {$appointment['doctor']['specialization']}\n";
    echo "Date: {$appointment['appointment_date']}\n";
} else {
    echo "\n❌ Erreur lors de la création du rendez-vous\n";
    if (isset($appointmentResponse['body']['errors'])) {
        echo "Erreurs de validation: " . json_encode($appointmentResponse['body']['errors'], JSON_PRETTY_PRINT) . "\n";
    }
}

echo "\n=== Fin du test ===\n";