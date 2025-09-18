<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class RenameSpecializationTempToSpecializationInDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Renommer la colonne specialization_temp en specialization
        DB::statement('ALTER TABLE doctors CHANGE specialization_temp specialization TEXT');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Renommer la colonne specialization en specialization_temp
        DB::statement('ALTER TABLE doctors CHANGE specialization specialization_temp TEXT');
    }
}
