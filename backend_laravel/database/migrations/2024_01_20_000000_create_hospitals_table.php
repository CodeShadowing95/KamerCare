<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hospitals', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('ville');
            $table->text('adresse');
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->enum('type', ['public', 'private'])->default('public');
            $table->string('photo')->nullable();
            $table->timestamps();

            // Index pour améliorer les performances de recherche
            $table->index('ville');
            $table->index('nom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospitals');
    }
};