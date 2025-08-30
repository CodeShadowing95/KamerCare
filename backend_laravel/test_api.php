<?php

// Test simple pour vérifier les relations via cURL
$baseUrl = 'http://localhost:8000/api';

// Fonction pour faire des requêtes API
function makeRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    $headers = ['Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'status' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

echo "=== Test des corrections Backend ===\n\n";

// Test 0: Créer un docteur de test
echo "0. Création d'un docteur de test...\n";
$registerResponse = makeRequest($baseUrl . '/register', 'POST', [
    'name' => 'Dr Test',
    'email' => 'test.doctor@example.com',
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'role' => 'doctor',
    'phone' => '+1234567890'
]);

if ($registerResponse['status'] === 201) {
    echo "✓ Docteur créé avec succès\n\n";
} else {
    echo "Note: Docteur peut-être déjà existant (" . $registerResponse['status'] . ")\n\n";
}

// Test 1: Connexion d'un docteur
echo "1. Test de connexion docteur...\n";
$loginResponse = makeRequest($baseUrl . '/login', 'POST', [
    'email' => 'test.doctor@example.com',
    'password' => 'password123'
]);

if ($loginResponse['status'] === 200 && isset($loginResponse['data']['token'])) {
    $token = $loginResponse['data']['token'];
    echo "✓ Connexion réussie\n\n";
    
    // Test 2: Récupération des patients du docteur
    echo "2. Test de récupération des patients...\n";
    $patientsResponse = makeRequest($baseUrl . '/patients', 'GET', null, $token);
    
    if ($patientsResponse['status'] === 200) {
        $patients = $patientsResponse['data']['data']['data'] ?? [];
        echo "✓ Patients récupérés: " . count($patients) . " patients\n";
        
        if (count($patients) > 0) {
            foreach ($patients as $patient) {
                echo "  - {$patient['first_name']} {$patient['last_name']} ({$patient['email']})\n";
            }
        } else {
            echo "  (Aucun patient assigné à ce docteur - c'est normal pour un nouveau docteur)\n";
        }
        
        // Test 3: Création d'un nouveau patient
        echo "\n3. Test de création d'un patient...\n";
        $newPatientResponse = makeRequest($baseUrl . '/patients', 'POST', [
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'email' => 'jean.dupont.test@example.com',
            'phone' => '+1234567891',
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
            'notes' => 'Patient de test créé automatiquement'
        ], $token);
        
        if ($newPatientResponse['status'] === 201) {
            echo "✓ Patient créé et assigné avec succès\n";
            
            // Test 4: Vérifier que le patient est maintenant dans la liste
            echo "\n4. Vérification de l'assignation...\n";
            $patientsResponse2 = makeRequest($baseUrl . '/patients', 'GET', null, $token);
            
            if ($patientsResponse2['status'] === 200) {
                $patients2 = $patientsResponse2['data']['data']['data'] ?? [];
                echo "✓ Patients après création: " . count($patients2) . " patients\n";
                
                foreach ($patients2 as $patient) {
                    echo "  - {$patient['first_name']} {$patient['last_name']} ({$patient['email']})\n";
                }
            }
        } else {
            echo "✗ Erreur lors de la création du patient: " . $newPatientResponse['status'] . "\n";
            echo "Response: " . json_encode($newPatientResponse['data']) . "\n";
        }
        
    } else {
        echo "✗ Erreur lors de la récupération des patients: " . $patientsResponse['status'] . "\n";
        echo "Response: " . json_encode($patientsResponse['data']) . "\n";
    }
    
} else {
    echo "✗ Échec de la connexion\n";
    echo "Response: " . json_encode($loginResponse['data']) . "\n";
}

echo "\n=== Test terminé ===\n";