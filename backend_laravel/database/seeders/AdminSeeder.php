<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Créer l'administrateur avec les coordonnées spécifiées
        $admin = User::firstOrCreate(
            ['email' => 'admin@kamercare.com'],
            [
                'name' => 'Kepta Ezechiel',
                'password' => Hash::make('pokemon2.0'),
                'role' => 'admin',
                'phone' => '+237 01234567',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        $this->command->info('Admin created successfully!');
        $this->command->info('Name: Kepta Ezechiel');
        $this->command->info('Email: admin@kamercare.com');
        $this->command->info('Password: pokemon2.0');
        $this->command->info('Phone: +237 01234567');
        $this->command->info('Role: admin');
    }
}