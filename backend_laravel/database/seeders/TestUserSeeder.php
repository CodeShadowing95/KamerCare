<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Créer un docteur de test avec des credentials connus
        $user = User::firstOrCreate(
            ['email' => 'test.doctor@example.com'],
            [
                'name' => 'Dr. Test Doctor',
                'password' => Hash::make('password123'),
                'role' => 'doctor',
                'email_verified_at' => now(),
            ]
        );

        Doctor::firstOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => 'Test',
                'last_name' => 'Doctor',
                'specialization' => 'General Medicine',
                'license_number' => 'TEST123456',
                'phone' => '+237123456789',
                'bio' => 'Docteur de test pour les tests API',
                'qualifications' => 'MD, General Practice',
                'years_of_experience' => 5,
                'office_address' => 'Test Hospital, Yaoundé',
                'consultation_hours' => '08:00-17:00',
                'consultation_fee' => 25000,
                'is_available' => true,
            ]
        );

        // Créer un patient de test
        $patientUser = User::firstOrCreate(
            ['email' => 'test.patient@example.com'],
            [
                'name' => 'Test Patient',
                'password' => Hash::make('password123'),
                'role' => 'patient',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Test doctor created successfully!');
        $this->command->info('Email: test.doctor@example.com');
        $this->command->info('Password: password123');
        $this->command->info('Test patient created successfully!');
        $this->command->info('Email: test.patient@example.com');
        $this->command->info('Password: password123');
    }
}