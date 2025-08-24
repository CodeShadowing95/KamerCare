<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        'App\Models\Patient' => 'App\Policies\PatientPolicy',
        'App\Models\Doctor' => 'App\Policies\DoctorPolicy',
        'App\Models\Appointment' => 'App\Policies\AppointmentPolicy',
        'App\Models\MedicalRecord' => 'App\Policies\MedicalRecordPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
