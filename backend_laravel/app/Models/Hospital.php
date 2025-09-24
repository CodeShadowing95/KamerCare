<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'type',
        'adresse',
        'ville',
        'telephone',
        'email',
        'photo',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'services_urgence' => 'boolean',
        'specialites' => 'array',
        'nombre_lits' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the doctors that belong to this hospital.
     */
    public function doctors()
    {
        return $this->hasMany(Doctor::class);
    }

    /**
     * Get the full address attribute.
     */
    public function getFullAddressAttribute()
    {
        return $this->adresse . ', ' . $this->ville;
    }

    /**
     * Scope a query to only include hospitals in a specific city.
     */
    public function scopeInCity($query, $city)
    {
        return $query->where('ville', $city);
    }

    /**
     * Get the photo URL attribute.
     */
    public function getPhotoUrlAttribute()
    {
        if ($this->photo) {
            return asset('storage/' . $this->photo);
        }
        return asset('images/default-hospital.png');
    }
}