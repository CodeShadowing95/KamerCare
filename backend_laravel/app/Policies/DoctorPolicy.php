<?php

namespace App\Policies;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DoctorPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Everyone can view the list of doctors (for appointment booking)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Doctor $doctor): bool
    {
        // Everyone can view doctor profiles (for appointment booking)
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins can create doctor accounts
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Doctor $doctor): bool
    {
        // Admins can update any doctor
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can update their own profile
        return $user->id === $doctor->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Doctor $doctor): bool
    {
        // Only admins can delete doctors
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Doctor $doctor): bool
    {
        // Only admins can restore doctors
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Doctor $doctor): bool
    {
        // Only admins can permanently delete doctors
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view doctor's appointments.
     */
    public function viewAppointments(User $user, Doctor $doctor): bool
    {
        // Admins can view any doctor's appointments
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view their own appointments
        return $user->id === $doctor->user_id;
    }

    /**
     * Determine whether the user can manage doctor's schedule.
     */
    public function manageSchedule(User $user, Doctor $doctor): bool
    {
        // Admins can manage any doctor's schedule
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can manage their own schedule
        return $user->id === $doctor->user_id;
    }

    /**
     * Determine whether the user can toggle doctor's availability.
     */
    public function toggleAvailability(User $user, Doctor $doctor): bool
    {
        // Admins can toggle any doctor's availability
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can toggle their own availability
        return $user->id === $doctor->user_id;
    }
}
