<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\User;
use App\Models\Hospital;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Doctor::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'date_of_birth' => $this->faker->date('Y-m-d', '1980-01-01'),
            'email' => $this->faker->unique()->safeEmail(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'specialization' => $this->faker->randomElement([
                'Cardiologie',
                'Dermatologie', 
                'Neurologie',
                'Pédiatrie',
                'Gynécologie',
                'Orthopédie',
                'Psychiatrie',
                'Médecine générale'
            ]),
            // 'hospital_id' => null, // Omis pour éviter les erreurs de contrainte
            'license_number' => $this->faker->unique()->numerify('LIC-####-####'),
            'phone' => $this->faker->phoneNumber(),
            'bio' => $this->faker->paragraph(3),
            'qualifications' => json_encode([
                $this->faker->sentence(4),
                $this->faker->sentence(3)
            ]),
            'education' => json_encode([
                $this->faker->sentence(5),
                $this->faker->sentence(4)
            ]),
            'certifications' => json_encode([
                $this->faker->sentence(3),
                $this->faker->sentence(4)
            ]),
            'references' => json_encode([
                $this->faker->sentence(6),
                $this->faker->sentence(5)
            ]),
            'years_of_experience' => (string) $this->faker->numberBetween(1, 30), // Cast en string
            'office_address' => $this->faker->address(),
            'consultation_hours' => json_encode([
                'monday' => '08:00-17:00',
                'tuesday' => '08:00-17:00',
                'wednesday' => '08:00-17:00',
                'thursday' => '08:00-17:00',
                'friday' => '08:00-17:00'
            ]),
            'consultation_fee' => $this->faker->randomFloat(2, 20, 200),
            'is_available' => $this->faker->boolean(80), // 80% de chance d'être disponible
            'is_certified' => $this->faker->randomElement(['Yes', 'No']), // Enum values
        ];
    }

    /**
     * Indicate that the doctor is available.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function available()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_available' => true,
            ];
        });
    }

    /**
     * Indicate that the doctor is not available.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unavailable()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_available' => false,
            ];
        });
    }

    /**
     * Indicate that the doctor is certified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function certified()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_certified' => true,
            ];
        });
    }

    /**
     * Set a specific specialization.
     *
     * @param string $specialization
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withSpecialization($specialization)
    {
        return $this->state(function (array $attributes) use ($specialization) {
            return [
                'specialization' => $specialization,
            ];
        });
    }

    /**
     * Set specific years of experience.
     *
     * @param int $years
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withExperience($years)
    {
        return $this->state(function (array $attributes) use ($years) {
            return [
                'years_of_experience' => $years,
            ];
        });
    }
}