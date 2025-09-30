<?php

namespace Tests\Unit;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de création d'un docteur
     */
    public function test_doctor_can_be_created()
    {
        $user = User::factory()->create(['role' => 'doctor']);
        
        $doctorData = [
            'user_id' => $user->id,
            'first_name' => 'Dr. Jean',
            'last_name' => 'Dupont',
            'email' => 'dr.dupont@example.com',
            'specialization' => 'Cardiologie',
            'license_number' => 'MD123456',
            'phone' => '+237123456789',
            'years_of_experience' => 10,
            'consultation_fee' => 50000.00,
            'is_available' => true,
            'is_certified' => true,
        ];

        $doctor = Doctor::create($doctorData);

        $this->assertInstanceOf(Doctor::class, $doctor);
        $this->assertEquals('Dr. Jean', $doctor->first_name);
        $this->assertEquals('Dupont', $doctor->last_name);
        $this->assertEquals('Cardiologie', $doctor->specialization);
        $this->assertTrue($doctor->is_available);
        $this->assertTrue($doctor->is_certified);
    }

    /**
     * Test des casts de type
     */
    public function test_doctor_casts()
    {
        $doctor = Doctor::factory()->create([
            'date_of_birth' => '1980-01-01',
            'consultation_fee' => 75000,
            'is_available' => 1,
            'qualifications' => ['Doctorat en Médecine', 'Spécialisation Cardiologie'],
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $doctor->date_of_birth);
        // Le cast decimal retourne une string, pas un float
        $this->assertIsString($doctor->consultation_fee);
        $this->assertEquals('75000.00', $doctor->consultation_fee);
        $this->assertIsBool($doctor->is_available);
        $this->assertIsArray($doctor->qualifications);
    }

    /**
     * Test des attributs fillable
     */
    public function test_doctor_fillable_attributes()
    {
        $fillable = [
            'user_id',
            'first_name',
            'last_name',
            'date_of_birth',
            'email',
            'address',
            'city',
            'specialization',
            'hospital_id',
            'license_number',
            'phone',
            'bio',
            'qualifications',
            'education',
            'certifications',
            'references',
            'years_of_experience',
            'office_address',
            'consultation_hours',
            'consultation_fee',
            'is_available',
            'is_certified',
        ];

        $doctor = new Doctor();
        $this->assertEquals($fillable, $doctor->getFillable());
    }

    /**
     * Test de la validation des années d'expérience
     */
    public function test_years_of_experience_validation()
    {
        $doctor = Doctor::factory()->create(['years_of_experience' => 15]);
        $this->assertIsInt($doctor->years_of_experience);
        $this->assertGreaterThanOrEqual(0, $doctor->years_of_experience);
    }

    /**
     * Test de la spécialisation
     */
    public function test_doctor_specialization()
    {
        $specializations = ['Cardiologie', 'Neurologie', 'Pédiatrie', 'Gynécologie'];
        
        foreach ($specializations as $specialization) {
            $doctor = Doctor::factory()->create(['specialization' => $specialization]);
            $this->assertEquals($specialization, $doctor->specialization);
        }
    }
}