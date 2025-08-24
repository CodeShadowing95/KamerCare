<?php

namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PatientPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admins and doctors can view all patients
        return $user->isAdmin() || $user->isDoctor();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Patient $patient): bool
    {
        // Admins can view any patient
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view their patients
        if ($user->isDoctor()) {
            return $patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can only view their own profile
        return $user->id === $patient->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins and doctors can create patient records
        return $user->isAdmin() || $user->isDoctor();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Patient $patient): bool
    {
        // Admins can update any patient
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can update their patients' basic info
        if ($user->isDoctor()) {
            return $patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can update their own profile (limited fields)
        return $user->id === $patient->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Patient $patient): bool
    {
        // Only admins can delete patients
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Patient $patient): bool
    {
        // Only admins can restore patients
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Patient $patient): bool
    {
        // Only admins can permanently delete patients
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view patient's medical records.
     */
    public function viewMedicalRecords(User $user, Patient $patient): bool
    {
        // Admins can view any patient's records
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view records of their patients
        if ($user->isDoctor()) {
            return $patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can view their own records
        return $user->id === $patient->user_id;
    }

    /**
     * Determine whether the user can view patient's appointments.
     */
    public function viewAppointments(User $user, Patient $patient): bool
    {
        // Admins can view any patient's appointments
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view appointments with their patients
        if ($user->isDoctor()) {
            return $patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can view their own appointments
        return $user->id === $patient->user_id;
    }
}
