<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Appointment extends Model
{
    use HasFactory;

    // Constants pour les types de rendez-vous
    const TYPE_PRESENTIEL = 'presentiel';
    const TYPE_VISIO = 'visio';
    const TYPE_DOMICILE = 'domicile';
    const TYPE_URGENCE = 'urgence';
    const TYPE_SUIVI = 'suivi';

    const APPOINTMENT_TYPES = [
        self::TYPE_PRESENTIEL => 'Présentiel',
        self::TYPE_VISIO => 'Visioconférence',
        self::TYPE_DOMICILE => 'À domicile',
        self::TYPE_URGENCE => 'Urgence',
        self::TYPE_SUIVI => 'Suivi',
    ];

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'appointment_date',
        'duration_minutes',
        'status',
        'appointment_type',
        'reason_for_visit',
        'notes',
        'consultation_fee',
        'payment_status',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'consultation_fee' => 'decimal:2',
        'duration_minutes' => 'integer',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
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

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>', now())
                    ->whereIn('status', ['scheduled', 'confirmed']);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('appointment_type', $type);
    }

    public function scopeVisio($query)
    {
        return $query->where('appointment_type', 'visio');
    }

    public function scopePresentiel($query)
    {
        return $query->where('appointment_type', 'presentiel');
    }

    // Accessors
    public function getEndTimeAttribute()
    {
        return $this->appointment_date->addMinutes($this->duration_minutes);
    }

    public function getIsUpcomingAttribute()
    {
        return $this->appointment_date > now() && in_array($this->status, ['scheduled', 'confirmed']);
    }

    public function getAppointmentTypeLabelAttribute()
    {
        return self::APPOINTMENT_TYPES[$this->appointment_type] ?? $this->appointment_type;
    }

    public function getIsVisioAttribute()
    {
        return $this->appointment_type === self::TYPE_VISIO;
    }

    public function getIsPresentielAttribute()
    {
        return $this->appointment_type === self::TYPE_PRESENTIEL;
    }

    public function getIsDomicileAttribute()
    {
        return $this->appointment_type === self::TYPE_DOMICILE;
    }

    // Methods
    public function confirm()
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function cancel($reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }
}
