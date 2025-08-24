<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_id',
        'visit_date',
        'chief_complaint',
        'history_of_present_illness',
        'physical_examination',
        'vital_signs',
        'diagnosis',
        'treatment_plan',
        'medications_prescribed',
        'lab_tests_ordered',
        'follow_up_instructions',
        'next_appointment_date',
        'doctor_notes',
        'attachments',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'next_appointment_date' => 'date',
        'attachments' => 'array',
    ];

    // Relations
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    // Scopes
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('visit_date', '>=', now()->subDays($days));
    }

    public function scopeByPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeByDoctor($query, $doctorId)
    {
        return $query->where('doctor_id', $doctorId);
    }

    // Accessors
    public function getHasAttachmentsAttribute()
    {
        return !empty($this->attachments);
    }

    // Methods
    public function addAttachment($filename, $path)
    {
        $attachments = $this->attachments ?? [];
        $attachments[] = [
            'filename' => $filename,
            'path' => $path,
            'uploaded_at' => now()->toISOString(),
        ];
        $this->update(['attachments' => $attachments]);
    }
}
