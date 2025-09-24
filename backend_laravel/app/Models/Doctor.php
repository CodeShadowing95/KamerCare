<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'date_of_birth',
        'email',
        'address',
        'city',
        'specialization',
        'hospital_id',
        'license_number',
        'phone',
        'bio',
        'qualifications',
        'education',
        'certifications',
        'references',
        'years_of_experience',
        'office_address',
        'consultation_hours',
        'consultation_fee',
        'is_available',
        'is_certified',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'qualifications' => 'array',
        'education' => 'array',
        'certifications' => 'array',
        'references' => 'array',
        'consultation_hours' => 'array',
        'consultation_fee' => 'decimal:2',
        'is_available' => 'boolean',

    ];

    protected $appends = ['name', 'full_name'];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function patients()
    {
        return $this->belongsToMany(Patient::class, 'doctor_patient')
                    ->withPivot(['assigned_at', 'notes', 'is_active'])
                    ->withTimestamps()
                    ->wherePivot('is_active', true);
    }

    public function allPatients()
    {
        return $this->belongsToMany(Patient::class, 'doctor_patient')
                    ->withPivot(['assigned_at', 'notes', 'is_active'])
                    ->withTimestamps();
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeBySpecialization($query, $specialization)
    {
        // Recherche dans la chaîne de spécialisations séparées par des virgules
        return $query->where('specialization', 'like', "%{$specialization}%");
    }
}
