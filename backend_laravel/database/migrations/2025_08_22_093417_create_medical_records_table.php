<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicalRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()->constrained()->onDelete('set null');
            $table->date('visit_date');
            $table->text('chief_complaint');
            $table->text('history_of_present_illness')->nullable();
            $table->text('physical_examination')->nullable();
            $table->text('vital_signs')->nullable();
            $table->text('diagnosis');
            $table->text('treatment_plan')->nullable();
            $table->text('medications_prescribed')->nullable();
            $table->text('lab_tests_ordered')->nullable();
            $table->text('follow_up_instructions')->nullable();
            $table->date('next_appointment_date')->nullable();
            $table->text('doctor_notes')->nullable();
            $table->json('attachments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medical_records');
    }
}
