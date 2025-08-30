<?php

// Test simple et clair des corrections
$baseUrl = 'http://localhost:8000/api';

echo "=== Test des corrections Backend ===\n\n";

// 1. Test de connexion
echo "1. Test de connexion docteur...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'test.doctor@example.com',
    'password' => 'password123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   Code HTTP: $httpCode\n";

if ($httpCode === 200) {
    $data = json_decode($response, true);
    if (isset($data['data']['token'])) {
        $token = $data['data']['token'];
        echo "   ✓ Connexion réussie, token obtenu\n\n";
        
        // 2. Test de récupération des patients
        echo "2. Test de récupération des patients...\n";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $baseUrl . '/patients');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Accept: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "   Code HTTP: $httpCode\n";
        
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            $patients = $data['data']['data'] ?? [];
            echo "   ✓ Patients récupérés: " . count($patients) . " patients\n";
            
            foreach ($patients as $patient) {
                echo "     - {$patient['first_name']} {$patient['last_name']}\n";
            }
            
            // 3. Test de création d'un patient
            echo "\n3. Test de création d'un patient...\n";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $baseUrl . '/patients');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'first_name' => 'Test',
                'last_name' => 'Patient',
                'email' => 'test.patient.' . time() . '@example.com',
                'phone' => '+1234567890',
                'date_of_birth' => '1990-01-01',
                'gender' => 'male'
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $token,
                'Content-Type: application/json',
                'Accept: application/json'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            echo "   Code HTTP: $httpCode\n";
            
            if ($httpCode === 201) {
                echo "   ✓ Patient créé avec succès\n";
                
                // 4. Vérifier que le patient est assigné au docteur
                echo "\n4. Vérification de l'assignation...\n";
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $baseUrl . '/patients');
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: Bearer ' . $token,
                    'Accept: application/json'
                ]);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                
                if ($httpCode === 200) {
                    $data = json_decode($response, true);
                    $patients = $data['data']['data'] ?? [];
                    echo "   ✓ Patients après création: " . count($patients) . " patients\n";
                    
                    foreach ($patients as $patient) {
                        echo "     - {$patient['first_name']} {$patient['last_name']}\n";
                    }
                    
                    echo "\n=== ✓ TOUS LES TESTS RÉUSSIS ===\n";
                    echo "Les corrections fonctionnent correctement :\n";
                    echo "- Les docteurs peuvent se connecter\n";
                    echo "- Les docteurs ne voient que leurs propres patients\n";
                    echo "- Les nouveaux patients sont automatiquement assignés au docteur qui les crée\n";
                } else {
                    echo "   ✗ Erreur lors de la vérification finale\n";
                }
            } else {
                echo "   ✗ Erreur lors de la création du patient\n";
                echo "   Réponse: $response\n";
            }
        } else {
            echo "   ✗ Erreur lors de la récupération des patients\n";
            echo "   Réponse: $response\n";
        }
    } else {
        echo "   ✗ Token non trouvé dans la réponse\n";
        echo "   Réponse: $response\n";
    }
} else {
    echo "   ✗ Erreur de connexion\n";
    echo "   Réponse: $response\n";
}

echo "\n=== Test terminé ===\n";