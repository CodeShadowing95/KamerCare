<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('specialization');
            $table->string('license_number')->unique();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->json('qualifications')->nullable();
            $table->integer('years_of_experience')->default(0);
            $table->text('office_address')->nullable();
            $table->json('consultation_hours')->nullable();
            $table->decimal('consultation_fee', 8, 2)->nullable();
            $table->boolean('is_available')->default(true);
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
        Schema::dropIfExists('doctors');
    }
}
