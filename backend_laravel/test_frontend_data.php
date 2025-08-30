<?php

require_once 'vendor/autoload.php';

// Get doctor token first
$loginData = [
    'email' => 'test.doctor@example.com',
    'password' => 'password123'
];

echo "Logging in doctor...\n";

$loginCh = curl_init();
curl_setopt($loginCh, CURLOPT_URL, 'http://localhost:8000/api/login');
curl_setopt($loginCh, CURLOPT_POST, true);
curl_setopt($loginCh, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($loginCh, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($loginCh, CURLOPT_RETURNTRANSFER, true);

$loginResponse = curl_exec($loginCh);
echo "Login response: " . substr($loginResponse, 0, 200) . "...\n";

$loginResult = json_decode($loginResponse, true);

if (!isset($loginResult['data']['token'])) {
    echo "Token not found in response\n";
    print_r($loginResult);
    exit(1);
}

$token = $loginResult['data']['token'];
echo "Doctor logged in successfully, token: " . substr($token, 0, 20) . "...\n";

// Simulate the exact data sent from frontend
$frontendData = [
    'appointment_date' => '1978-01-13 20:14:00',
    'consultation_fee' => 0,
    'doctor_id' => 4,
    'duration_minutes' => 90,
    'notes' => 'Qui irure dolore inc',
    'patient_id' => 3,
    'reason_for_visit' => 'Nulla ex veniam aut'
];

echo "\nTesting appointment creation with frontend data:\n";
print_r($frontendData);

// Now create appointment
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/appointments');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($frontendData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "\nHTTP Status Code: $httpCode\n";
echo "Response: $response\n";

if ($httpCode === 201) {
    echo "\nAppointment created successfully!\n";
} else {
    echo "\nAppointment creation failed!\n";
}

curl_close($ch);
curl_close($loginCh);

?>