<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstName = $this->faker->firstName($gender);
        $lastName = $this->faker->lastName();
        
        return [
            'user_id' => User::factory()->create(['role' => 'patient']),
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'date_of_birth' => $this->faker->dateTimeBetween('-80 years', '-18 years'),
            'gender' => $gender,
            'address' => $this->faker->address(),
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_phone' => $this->faker->phoneNumber(),
            'medical_history' => $this->faker->optional()->paragraph(),
            'allergies' => $this->faker->optional()->words(3, true),
            'current_medications' => $this->faker->optional()->words(5, true),
            'blood_type' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'insurance_number' => $this->faker->optional()->numerify('INS-####-####-####'),
        ];
    }

    /**
     * Indicate that the patient is male.
     */
    public function male(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'male',
            'first_name' => $this->faker->firstNameMale(),
        ]);
    }

    /**
     * Indicate that the patient is female.
     */
    public function female(): static
    {
        return $this->state(fn (array $attributes) => [
            'gender' => 'female',
            'first_name' => $this->faker->firstNameFemale(),
        ]);
    }

    /**
     * Indicate that the patient is a child.
     */
    public function child(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_of_birth' => $this->faker->dateTimeBetween('-17 years', '-1 year'),
        ]);
    }

    /**
     * Indicate that the patient is elderly.
     */
    public function elderly(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_of_birth' => $this->faker->dateTimeBetween('-90 years', '-65 years'),
        ]);
    }

    /**
     * Indicate that the patient has allergies.
     */
    public function withAllergies(): static
    {
        return $this->state(fn (array $attributes) => [
            'allergies' => $this->faker->randomElements([
                'Pénicilline', 'Aspirine', 'Arachides', 'Fruits de mer', 
                'Latex', 'Pollen', 'Poussière', 'Iode'
            ], rand(1, 3)),
        ]);
    }

    /**
     * Indicate that the patient has medical history.
     */
    public function withMedicalHistory(): static
    {
        return $this->state(fn (array $attributes) => [
            'medical_history' => $this->faker->paragraphs(2, true),
        ]);
    }

    /**
     * Indicate that the patient has current medications.
     */
    public function withMedications(): static
    {
        return $this->state(fn (array $attributes) => [
            'current_medications' => $this->faker->randomElements([
                'Paracétamol', 'Ibuprofène', 'Aspirine', 'Doliprane',
                'Metformine', 'Lisinopril', 'Atorvastatine', 'Oméprazole'
            ], rand(1, 4)),
        ]);
    }

    /**
     * Indicate that the patient has insurance.
     */
    public function withInsurance(): static
    {
        return $this->state(fn (array $attributes) => [
            'insurance_number' => $this->faker->numerify('INS-####-####-####'),
        ]);
    }

    /**
     * Create a patient with a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }
}