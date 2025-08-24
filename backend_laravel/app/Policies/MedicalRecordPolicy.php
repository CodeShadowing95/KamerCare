<?php

namespace App\Policies;

use App\Models\MedicalRecord;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MedicalRecordPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admins and doctors can view medical records
        return $user->isAdmin() || $user->isDoctor();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can view any medical record
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view records they created or for their patients
        if ($user->isDoctor()) {
            return $medicalRecord->doctor_id === $user->doctor->id ||
                   $medicalRecord->patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can view their own medical records
        if ($user->isPatient()) {
            return $medicalRecord->patient_id === $user->patient->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only doctors and admins can create medical records
        return $user->isDoctor() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can update any medical record
        if ($user->isAdmin()) {
            return true;
        }

        // Only the doctor who created the record can update it
        if ($user->isDoctor()) {
            return $medicalRecord->doctor_id === $user->doctor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can delete any medical record
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can delete records they created (within a reasonable time frame)
        if ($user->isDoctor()) {
            return $medicalRecord->doctor_id === $user->doctor->id &&
                   $medicalRecord->created_at->diffInHours(now()) <= 24; // 24 hours limit
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MedicalRecord $medicalRecord): bool
    {
        // Only admins can restore medical records
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MedicalRecord $medicalRecord): bool
    {
        // Only admins can permanently delete medical records
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can add attachments to the medical record.
     */
    public function addAttachment(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can add attachments to any medical record
        if ($user->isAdmin()) {
            return true;
        }

        // Only the doctor who created the record can add attachments
        if ($user->isDoctor()) {
            return $medicalRecord->doctor_id === $user->doctor->id;
        }

        return false;
    }

    /**
     * Determine whether the user can generate reports for the patient.
     */
    public function generateReport(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can generate reports for any patient
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can generate reports for their patients
        if ($user->isDoctor()) {
            return $medicalRecord->patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can generate their own reports
        if ($user->isPatient()) {
            return $medicalRecord->patient_id === $user->patient->id;
        }

        return false;
    }

    /**
     * Determine whether the user can view patient's medical history.
     */
    public function viewPatientHistory(User $user, MedicalRecord $medicalRecord): bool
    {
        // Admins can view any patient's history
        if ($user->isAdmin()) {
            return true;
        }

        // Doctors can view history of their patients
        if ($user->isDoctor()) {
            return $medicalRecord->patient->appointments()->where('doctor_id', $user->doctor->id)->exists();
        }

        // Patients can view their own history
        if ($user->isPatient()) {
            return $medicalRecord->patient_id === $user->patient->id;
        }

        return false;
    }
}
