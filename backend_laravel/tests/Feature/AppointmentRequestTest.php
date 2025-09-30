<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Carbon\Carbon;

class AppointmentRequestTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $patient;
    protected $patientUser;
    protected $doctor;
    protected $doctorUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Créer un utilisateur patient avec un email unique
        $this->patientUser = User::factory()->create([
            'role' => 'patient',
            'email' => 'patient' . uniqid() . '@test.com'
        ]);
        
        // Créer un patient associé
        $this->patient = Patient::factory()->forUser($this->patientUser)->create();
        
        // Créer un utilisateur docteur avec un email unique
        $this->doctorUser = User::factory()->create([
            'role' => 'doctor',
            'email' => 'doctor' . uniqid() . '@test.com'
        ]);
        
        // Créer un docteur associé
        $this->doctor = Doctor::factory()->create([
            'user_id' => $this->doctorUser->id
        ]);
    }

    /** @test */
    public function patient_can_create_appointment_request()
    {
        $appointmentData = [
            'patient_id' => $this->patientUser->id, // ID de l'utilisateur patient
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'notes' => 'Première consultation',
            'patient_data' => [
                'first_name' => $this->patient->first_name,
                'last_name' => $this->patient->last_name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'date_of_birth' => $this->patient->date_of_birth->format('Y-m-d'),
                'gender' => $this->patient->gender,
            ]
        ];

        $response = $this->actingAs($this->patientUser, 'sanctum')
                         ->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Appointment created successfully'
                ])
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'id',
                        'patient_id',
                        'doctor_id',
                        'created_by_user_id',
                        'appointment_date',
                        'duration_minutes',
                        'status',
                        'appointment_type',
                        'reason_for_visit',
                        'notes',
                        'patient',
                        'doctor',
                        'created_by'
                    ],
                    'message'
                ]);

        // Vérifier que le rendez-vous a été créé en base
        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'status' => 'requested', // Statut par défaut pour une demande patient
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'reason_for_visit' => 'Consultation générale'
        ]);
    }

    /** @test */
    public function appointment_request_requires_authentication()
    {
        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'created_by_user_id' => $this->patientUser->id
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(401);
    }

    /** @test */
    public function appointment_request_validates_required_fields()
    {
        $this->actingAs($this->patientUser);

        // Test sans patient_id
        $response = $this->postJson('/api/appointments', []);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['patient_id', 'doctor_id', 'appointment_date', 'duration_minutes', 'appointment_type', 'reason_for_visit', 'consultation_fee', 'created_by_user_id']);

        // Test avec appointment_type presentiel sans location
        $response = $this->postJson('/api/appointments', [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'created_by_user_id' => $this->patientUser->id
            // location manquant pour type presentiel
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['location']);
    }

    /** @test */
    public function appointment_request_validates_doctor_exists()
    {
        $this->actingAs($this->patientUser);

        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => 999, // ID inexistant
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'created_by_user_id' => $this->patientUser->id
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['doctor_id']);
    }

    /** @test */
    public function appointment_request_validates_future_date()
    {
        $this->actingAs($this->patientUser);

        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::yesterday()->toDateTimeString(), // Date passée
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'created_by_user_id' => $this->patientUser->id
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['appointment_date']);
    }

    /** @test */
    public function appointment_request_validates_appointment_type()
    {
        $this->actingAs($this->patientUser);

        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => 'invalid_type', // Type invalide
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'created_by_user_id' => $this->patientUser->id
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['appointment_type']);
    }

    /** @test */
    public function appointment_request_checks_doctor_availability()
    {
        // Créer un rendez-vous existant
        $existingAppointment = Appointment::factory()->create([
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 0),
            'duration_minutes' => 60,
            'status' => 'confirmed'
        ]);

        // Essayer de créer un rendez-vous en conflit
        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'appointment_date' => Carbon::tomorrow()->setTime(14, 30)->toDateTimeString(), // Conflit
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation générale',
            'consultation_fee' => 50.00,
            'patient_data' => [
                'first_name' => $this->patient->first_name,
                'last_name' => $this->patient->last_name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'date_of_birth' => $this->patient->date_of_birth->format('Y-m-d'),
                'gender' => $this->patient->gender,
            ]
        ];

        $response = $this->actingAs($this->patientUser, 'sanctum')
                         ->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422)
                ->assertJson([
                    'success' => false,
                    'message' => 'Doctor is not available at the requested time'
                ]);
    }

    /** @test */
    public function patient_can_create_video_consultation_request()
    {
        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'appointment_date' => Carbon::tomorrow()->setTime(16, 0)->toDateTimeString(),
            'duration_minutes' => 45,
            'appointment_type' => Appointment::TYPE_VISIO,
            'reason_for_visit' => 'Téléconsultation de suivi',
            'consultation_fee' => 45.00,
            'notes' => 'Suivi post-opératoire',
            'patient_data' => [
                'first_name' => $this->patient->first_name,
                'last_name' => $this->patient->last_name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'date_of_birth' => $this->patient->date_of_birth->format('Y-m-d'),
                'gender' => $this->patient->gender,
            ]
        ];

        $response = $this->actingAs($this->patientUser, 'sanctum')
                         ->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'appointment_type' => Appointment::TYPE_VISIO,
                        'status' => 'requested'
                    ]
                ]);

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'appointment_type' => Appointment::TYPE_VISIO,
            'status' => 'requested'
        ]);
    }

    /** @test */
    public function patient_can_create_home_visit_request()
    {
        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'appointment_date' => Carbon::tomorrow()->setTime(10, 0)->toDateTimeString(),
            'duration_minutes' => 60,
            'appointment_type' => Appointment::TYPE_DOMICILE,
            'location' => '123 Rue de la Paix, 75001 Paris',
            'reason_for_visit' => 'Visite à domicile',
            'consultation_fee' => 80.00,
            'notes' => 'Patient à mobilité réduite',
            'patient_data' => [
                'first_name' => $this->patient->first_name,
                'last_name' => $this->patient->last_name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'date_of_birth' => $this->patient->date_of_birth->format('Y-m-d'),
                'gender' => $this->patient->gender,
            ]
        ];

        $response = $this->actingAs($this->patientUser, 'sanctum')
                         ->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'appointment_type' => Appointment::TYPE_DOMICILE,
                        'location' => '123 Rue de la Paix, 75001 Paris',
                        'status' => 'requested'
                    ]
                ]);

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'appointment_type' => Appointment::TYPE_DOMICILE,
            'location' => '123 Rue de la Paix, 75001 Paris',
            'status' => 'requested'
        ]);
    }

    /** @test */
    public function doctor_created_appointment_has_scheduled_status()
    {
        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->doctorUser->id, // Créé par le docteur
            'appointment_date' => Carbon::tomorrow()->setTime(11, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Consultation programmée par le médecin',
            'consultation_fee' => 60.00,
            'patient_data' => [
                'first_name' => $this->patient->first_name,
                'last_name' => $this->patient->last_name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'date_of_birth' => $this->patient->date_of_birth->format('Y-m-d'),
                'gender' => $this->patient->gender,
            ]
        ];

        $response = $this->actingAs($this->doctorUser, 'sanctum')
                         ->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'status' => 'scheduled', // Statut différent pour les docteurs
                        'created_by_user_id' => $this->doctorUser->id
                    ]
                ]);

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->doctorUser->id,
            'status' => 'scheduled'
        ]);
    }

    /** @test */
    public function appointment_request_creates_or_finds_patient()
    {
        $this->actingAs($this->patientUser);

        // Supprimer le patient existant pour tester la création automatique
        $this->patient->delete();

        $appointmentData = [
            'patient_id' => $this->patientUser->id,
            'doctor_id' => $this->doctor->id,
            'appointment_date' => Carbon::tomorrow()->setTime(15, 0)->toDateTimeString(),
            'duration_minutes' => 30,
            'appointment_type' => Appointment::TYPE_PRESENTIEL,
            'location' => 'Cabinet médical',
            'reason_for_visit' => 'Première consultation',
            'consultation_fee' => 55.00,
            'created_by_user_id' => $this->patientUser->id
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201);

        // Vérifier qu'un patient a été créé automatiquement
        $this->assertDatabaseHas('patients', [
            'user_id' => $this->patientUser->id,
            'email' => $this->patientUser->email
        ]);

        // Vérifier que le rendez-vous a été créé avec le bon patient
        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'created_by_user_id' => $this->patientUser->id,
            'status' => 'requested'
        ]);
    }
}