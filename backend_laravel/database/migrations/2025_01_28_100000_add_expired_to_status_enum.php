<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddExpiredToStatusEnum extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Ajouter une nouvelle colonne temporaire avec le nouvel enum
        DB::statement("ALTER TABLE appointments ADD COLUMN status_new ENUM('requested', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'expired') DEFAULT 'requested'");
        
        // Copier les données de l'ancienne colonne vers la nouvelle
        DB::statement("UPDATE appointments SET status_new = status");
        
        // Supprimer l'ancienne colonne
        DB::statement("ALTER TABLE appointments DROP COLUMN status");
        
        // Renommer la nouvelle colonne
        DB::statement("ALTER TABLE appointments CHANGE COLUMN status_new status ENUM('requested', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'expired') DEFAULT 'requested'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Ajouter une nouvelle colonne temporaire avec l'ancien enum
        DB::statement("ALTER TABLE appointments ADD COLUMN status_old ENUM('requested', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'requested'");
        
        // Copier les données (sauf 'expired' qui sera converti en 'cancelled')
        DB::statement("UPDATE appointments SET status_old = CASE WHEN status = 'expired' THEN 'cancelled' ELSE status END");
        
        // Supprimer l'ancienne colonne
        DB::statement("ALTER TABLE appointments DROP COLUMN status");
        
        // Renommer la nouvelle colonne
        DB::statement("ALTER TABLE appointments CHANGE COLUMN status_old status ENUM('requested', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'requested'");
    }
}