<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Commands\Seed\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Carbon\Carbon;

class RequestedAppointmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer quelques rendez-vous avec le statut 'requested'
        $appointments = [
            [
                'patient_id' => 1,
                'doctor_id' => 1,
                'appointment_date' => Carbon::now()->addDays(1)->setTime(9, 0),
                'status' => 'requested',
                'appointment_type' => 'presentiel',
                'reason_for_visit' => 'Consultation générale',
                'duration_minutes' => 30,
                'consultation_fee' => 25000,
                'created_by_user_id' => 1,
            ],
            [
                'patient_id' => 1,
                'doctor_id' => 1,
                'appointment_date' => Carbon::now()->addDays(2)->setTime(14, 30),
                'status' => 'requested',
                'appointment_type' => 'visio',
                'reason_for_visit' => 'Suivi médical',
                'duration_minutes' => 45,
                'consultation_fee' => 30000,
                'created_by_user_id' => 1,
            ],
            [
                'patient_id' => 1,
                'doctor_id' => 1,
                'appointment_date' => Carbon::now()->addDays(3)->setTime(10, 15),
                'status' => 'requested',
                'appointment_type' => 'domicile',
                'reason_for_visit' => 'Visite à domicile',
                'duration_minutes' => 60,
                'consultation_fee' => 40000,
                'created_by_user_id' => 1,
            ],
        ];

        foreach ($appointments as $appointmentData) {
            Appointment::create($appointmentData);
        }

        $this->command->info('Created ' . count($appointments) . ' requested appointments.');
    }
}
