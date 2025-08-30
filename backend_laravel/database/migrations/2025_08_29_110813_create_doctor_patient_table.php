<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorPatientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctor_patient', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->text('notes')->nullable(); // Notes du docteur sur ce patient
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Éviter les doublons
            $table->unique(['doctor_id', 'patient_id']);
            
            // Index pour les requêtes
            $table->index(['doctor_id', 'is_active']);
            $table->index(['patient_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('doctor_patient');
    }
}
