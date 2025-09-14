<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddUnpaidToPaymentStatusEnum extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Modifier l'enum pour ajouter 'unpaid' et changer la valeur par défaut
        DB::statement("ALTER TABLE appointments MODIFY COLUMN payment_status ENUM('pending', 'paid', 'refunded', 'unpaid') DEFAULT 'unpaid'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revenir à l'ancien enum sans 'unpaid' et remettre 'pending' par défaut
        DB::statement("ALTER TABLE appointments MODIFY COLUMN payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending'");
    }
}