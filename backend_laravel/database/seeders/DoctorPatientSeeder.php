<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Patient;
use Carbon\Carbon;
use Faker\Factory as Faker;

class DoctorPatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Récupérer tous les docteurs et patients existants
        $doctors = Doctor::all();
        $patients = Patient::all();

        if ($doctors->isEmpty() || $patients->isEmpty()) {
            $this->command->info('No doctors or patients found. Please run DoctorSeeder and PatientSeeder first.');
            return;
        }

        // Assigner des patients à chaque docteur
        foreach ($doctors as $doctor) {
            // Assigner 2-5 patients aléatoires à chaque docteur
            $patientCount = rand(2, min(5, $patients->count()));
            $assignedPatients = $patients->random($patientCount);

            foreach ($assignedPatients as $patient) {
                // Vérifier si la relation n'existe pas déjà
                if (!$doctor->allPatients()->where('patient_id', $patient->id)->exists()) {
                    $doctor->patients()->attach($patient->id, [
                        'assigned_at' => Carbon::now()->subDays(rand(1, 30)),
                        'notes' => 'Patient assigné via seeder - Suivi médical régulier',
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }

        $this->command->info('Doctor-Patient relationships created successfully!');
    }
}
