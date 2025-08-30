<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'medical_history',
        'allergies',
        'current_medications',
        'blood_type',
        'insurance_number',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    // Relations
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctors()
    {
        return $this->belongsToMany(Doctor::class, 'doctor_patient')
                    ->withPivot(['assigned_at', 'notes', 'is_active'])
                    ->withTimestamps()
                    ->wherePivot('is_active', true);
    }

    public function allDoctors()
    {
        return $this->belongsToMany(Doctor::class, 'doctor_patient')
                    ->withPivot(['assigned_at', 'notes', 'is_active'])
                    ->withTimestamps();
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAgeAttribute()
    {
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }
}
