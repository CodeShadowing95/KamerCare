<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\CitiesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/doctors', [DoctorController::class, 'store']); // Public doctor registration

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Legacy route for compatibility
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User search routes for appointments
    Route::get('/users/search', [UserController::class, 'search']);
    
    // Patient management routes
    Route::apiResource('patients', PatientController::class);
    Route::get('/patients/search', [PatientController::class, 'search']);
    Route::get('/patients/{patient}/appointments', [PatientController::class, 'appointments']);
    Route::get('/patients/{patient}/medical-records', [PatientController::class, 'medicalRecords']);

    // Doctor management routes
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
    Route::get('/doctors/{doctor}/appointments', [DoctorController::class, 'appointments']);
    Route::get('/doctors/{doctor}/medical-records', [DoctorController::class, 'medicalRecords']);
    Route::patch('/doctors/{doctor}/toggle-availability', [DoctorController::class, 'toggleAvailability']);
    Route::get('/doctors/specializations', [DoctorController::class, 'specializations']);

    // Appointment management routes
    Route::apiResource('appointments', AppointmentController::class);
    Route::patch('/appointments/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::patch('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::patch('/appointments/{appointment}/complete', [AppointmentController::class, 'complete']);
    Route::post('/appointments/{appointment}/accept', [AppointmentController::class, 'accept']);
    Route::post('/appointments/{appointment}/reject', [AppointmentController::class, 'reject']);
    Route::get('/appointments/today', [AppointmentController::class, 'today']);
    Route::get('/appointments/upcoming', [AppointmentController::class, 'upcoming']);
    Route::get('/appointments/types', [AppointmentController::class, 'getAppointmentTypes']);
    Route::get('/doctors/{doctor}/available-slots', [AppointmentController::class, 'getAvailableSlots']);

    // Medical record management routes
    Route::apiResource('medical-records', MedicalRecordController::class);
    Route::post('/medical-records/{medicalRecord}/attachments', [MedicalRecordController::class, 'addAttachment']);
    Route::get('/patients/{patient}/medical-history', [MedicalRecordController::class, 'patientHistory']);
    Route::get('/doctors/{doctor}/patient-records', [MedicalRecordController::class, 'doctorRecords']);
    Route::get('/patients/{patient}/medical-report', [MedicalRecordController::class, 'generateReport']);
});

// Public routes for getting available doctors and specializations
Route::get('/public/doctors', [DoctorController::class, 'index']);

// Public routes for cities and regions
Route::prefix('cities')->group(function () {
    Route::get('/regions', [CitiesController::class, 'getRegions']);
    Route::get('/by-region', [CitiesController::class, 'getCitiesByRegion']);
    Route::get('/search', [CitiesController::class, 'searchCities']);
});
Route::get('/public/specializations', [DoctorController::class, 'specializations']);
