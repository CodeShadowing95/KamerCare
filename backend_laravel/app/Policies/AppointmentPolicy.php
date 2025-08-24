<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AppointmentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view appointments (filtered by their role)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        // Admins can view any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view their appointments
        if ($user->isDoctor()) {
            return $appointment->doctor_id === $user->doctor->id;
        }

        // Patients can view their appointments
        if ($user->isPatient()) {
            return $appointment->patient_id === $user->patient->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Patients can create appointments, admins and doctors can create on behalf of patients
        return $user->isPatient() || $user->isDoctor() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        // Admins can update any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can update their appointments (status, notes)
        if ($user->isDoctor()) {
            return $appointment->doctor_id === $user->doctor->id;
        }

        // Patients can update their appointments (only if pending and not in the past)
        if ($user->isPatient()) {
            return $appointment->patient_id === $user->patient->id 
                && $appointment->status === 'pending'
                && $appointment->appointment_date > now();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        // Admins can delete any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Patients can cancel their appointments (only if pending and not in the past)
        if ($user->isPatient()) {
            return $appointment->patient_id === $user->patient->id 
                && $appointment->status === 'pending'
                && $appointment->appointment_date > now();
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Appointment $appointment): bool
    {
        // Only admins can restore appointments
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Appointment $appointment): bool
    {
        // Only admins can permanently delete appointments
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can confirm the appointment.
     */
    public function confirm(User $user, Appointment $appointment): bool
    {
        // Admins can confirm any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can confirm their appointments
        if ($user->isDoctor()) {
            return $appointment->doctor_id === $user->doctor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can cancel the appointment.
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        // Admins can cancel any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can cancel their appointments
        if ($user->isDoctor()) {
            return $appointment->doctor_id === $user->doctor->id;
        }

        // Patients can cancel their appointments (only if not completed)
        if ($user->isPatient()) {
            return $appointment->patient_id === $user->patient->id 
                && $appointment->status !== 'completed';
        }

        return false;
    }

    /**
     * Determine whether the user can complete the appointment.
     */
    public function complete(User $user, Appointment $appointment): bool
    {
        // Admins can complete any appointment
        if ($user->isAdmin()) {
            return true;
        }

        // Only doctors can complete their appointments
        if ($user->isDoctor()) {
            return $appointment->doctor_id === $user->doctor->id;
        }

        return false;
    }
}
