<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::rename("plans", "plans_old");

    Schema::table("plans_old", function (Blueprint $schema) {
      $schema
        ->text("options")
        ->nullable()
        ->change();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::rename("plans_old", "plans");
  }
};
