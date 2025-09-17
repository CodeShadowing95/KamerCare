<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Exception;

class ChangeSpecializationToTextInDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Vérifier si la table doctors existe
        if (!Schema::hasTable('doctors')) {
            throw new Exception('La table doctors n\'existe pas. Assurez-vous que la migration create_doctors_table a été exécutée.');
        }
        
        // Vérifier si la colonne temporaire existe déjà et la supprimer si c'est le cas
        $columns = Schema::getColumnListing('doctors');
        if (in_array('specialization_temp', $columns)) {
            DB::statement('ALTER TABLE doctors DROP COLUMN specialization_temp');
        }
        
        // Ajouter une colonne temporaire de type TEXT
        DB::statement('ALTER TABLE doctors ADD COLUMN specialization_temp TEXT');
        
        // Convertir les données JSON existantes en chaînes séparées par des virgules
        $doctors = DB::table('doctors')->whereNotNull('specialization')->get();
        
        foreach ($doctors as $doctor) {
            $specializations = json_decode($doctor->specialization, true);
            if (is_array($specializations)) {
                $specializationString = implode(', ', $specializations);
                DB::table('doctors')
                    ->where('id', $doctor->id)
                    ->update(['specialization_temp' => $specializationString]);
            } else {
                // Si ce n'est pas un JSON valide, garder la valeur telle quelle
                DB::table('doctors')
                    ->where('id', $doctor->id)
                    ->update(['specialization_temp' => $doctor->specialization]);
            }
        }
        
        // Supprimer l'ancienne colonne et renommer la nouvelle
        DB::statement('ALTER TABLE doctors DROP COLUMN specialization');
        DB::statement('ALTER TABLE doctors RENAME COLUMN specialization_temp TO specialization');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Ajouter une colonne temporaire de type JSON
        DB::statement('ALTER TABLE doctors ADD COLUMN specialization_temp JSON');
        
        // Convertir les chaînes séparées par des virgules en JSON
        $doctors = DB::table('doctors')->whereNotNull('specialization')->get();
        
        foreach ($doctors as $doctor) {
            if (is_string($doctor->specialization)) {
                $specializations = array_map('trim', explode(',', $doctor->specialization));
                $specializationJson = json_encode($specializations);
                DB::table('doctors')
                    ->where('id', $doctor->id)
                    ->update(['specialization_temp' => $specializationJson]);
            }
        }
        
        // Supprimer l'ancienne colonne et renommer la nouvelle
        DB::statement('ALTER TABLE doctors DROP COLUMN specialization');
        DB::statement('ALTER TABLE doctors RENAME COLUMN specialization_temp TO specialization');
    }
}