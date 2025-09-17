<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalFieldsToDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('doctors', function (Blueprint $table) {
            // Nouveaux champs pour les informations personnelles
            $table->date('date_of_birth')->nullable()->after('last_name');
            $table->string('email')->nullable()->after('date_of_birth');
            $table->text('address')->nullable()->after('email');
            $table->string('city')->nullable()->after('address');
            
            // Nouveaux champs pour les informations professionnelles
            $table->string('hospital')->nullable()->after('specialization');
            $table->json('education')->nullable()->after('qualifications');
            $table->json('certifications')->nullable()->after('education');
            $table->json('references')->nullable()->after('certifications');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'email',
                'address',
                'city',
                'hospital',
                'education',
                'certifications',
                'references'
            ]);
        });
    }
}
