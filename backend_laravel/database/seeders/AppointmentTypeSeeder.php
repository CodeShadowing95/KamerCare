<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;

class AppointmentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Mettre à jour les rendez-vous existants avec différents types
        $appointments = Appointment::all();
        
        $types = [
            Appointment::TYPE_PRESENTIEL,
            Appointment::TYPE_VISIO,
            Appointment::TYPE_DOMICILE,
            Appointment::TYPE_URGENCE,
            Appointment::TYPE_SUIVI
        ];
        
        foreach ($appointments as $appointment) {
            // Assigner un type aléatoire à chaque rendez-vous existant
            $randomType = $types[array_rand($types)];
            
            // Pour les rendez-vous de suivi, utiliser le type 'suivi'
            if (str_contains(strtolower($appointment->reason_for_visit ?? ''), 'suivi')) {
                $randomType = Appointment::TYPE_SUIVI;
            }
            // Pour les urgences
            elseif (str_contains(strtolower($appointment->reason_for_visit ?? ''), 'urgence')) {
                $randomType = Appointment::TYPE_URGENCE;
            }
            
            $appointment->update(['appointment_type' => $randomType]);
        }
        
        $this->command->info('Types de rendez-vous mis à jour pour ' . $appointments->count() . ' rendez-vous.');
    }
}
