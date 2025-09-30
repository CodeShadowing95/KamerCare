<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $appointmentDate = $this->faker->dateTimeBetween('now', '+30 days');
        
        return [
            'patient_id' => Patient::factory(),
            'doctor_id' => Doctor::factory(),
            'created_by_user_id' => User::factory(),
            'appointment_date' => $appointmentDate,
            'duration_minutes' => $this->faker->randomElement([30, 45, 60]),
            'status' => $this->faker->randomElement(['requested', 'scheduled', 'confirmed', 'completed', 'cancelled']),
            'appointment_type' => $this->faker->randomElement([
                Appointment::TYPE_PRESENTIEL,
                Appointment::TYPE_VISIO,
                Appointment::TYPE_DOMICILE,
                Appointment::TYPE_URGENCE,
                Appointment::TYPE_SUIVI
            ]),
            'location' => $this->faker->optional()->address,
            'reason_for_visit' => $this->faker->sentence(),
            'notes' => $this->faker->optional()->paragraph(),
            'consultation_fee' => $this->faker->randomFloat(2, 50, 200),
            'payment_status' => $this->faker->randomElement(['pending', 'paid', 'refunded', 'unpaid']),
            'confirmed_at' => null,
            'cancelled_at' => null,
            'cancellation_reason' => null,
        ];
    }

    /**
     * Indicate that the appointment is requested by a patient.
     */
    public function requested(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'requested',
            'confirmed_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the appointment is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'confirmed_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the appointment is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'confirmed_at' => now(),
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the appointment is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $this->faker->sentence(),
            'confirmed_at' => null,
        ]);
    }

    /**
     * Indicate that the appointment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'confirmed_at' => now()->subDays(1),
            'cancelled_at' => null,
        ]);
    }

    /**
     * Indicate that the appointment is for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_date' => Carbon::today()->addHours(rand(9, 17)),
        ]);
    }

    /**
     * Indicate that the appointment is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_date' => Carbon::now()->addDays(rand(1, 30))->addHours(rand(9, 17)),
            'status' => $this->faker->randomElement(['scheduled', 'confirmed']),
        ]);
    }

    /**
     * Indicate that the appointment is a video consultation.
     */
    public function visio(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => Appointment::TYPE_VISIO,
            'location' => null,
        ]);
    }

    /**
     * Indicate that the appointment is at home.
     */
    public function atHome(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => Appointment::TYPE_DOMICILE,
            'location' => $this->faker->address,
        ]);
    }

    /**
     * Indicate that the appointment is an emergency.
     */
    public function emergency(): static
    {
        return $this->state(fn (array $attributes) => [
            'appointment_type' => Appointment::TYPE_URGENCE,
            'appointment_date' => Carbon::now()->addHours(rand(1, 4)),
            'status' => 'scheduled',
        ]);
    }

    /**
     * Indicate that the appointment is created by a patient.
     */
    public function createdByPatient(): static
    {
        return $this->state(function (array $attributes) {
            $patientUser = User::factory()->create(['role' => 'patient']);
            return [
                'created_by_user_id' => $patientUser->id,
                'status' => 'requested', // Les patients créent des demandes
            ];
        });
    }

    /**
     * Indicate that the appointment is created by a doctor.
     */
    public function createdByDoctor(): static
    {
        return $this->state(function (array $attributes) {
            $doctorUser = User::factory()->create(['role' => 'doctor']);
            return [
                'created_by_user_id' => $doctorUser->id,
                'status' => 'scheduled', // Les docteurs créent des RDV programmés
            ];
        });
    }
}