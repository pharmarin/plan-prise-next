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
    Schema::table("users", function (Blueprint $table) {
      $table->dropColumn(["name", "email_verified_at"]);

      $table
        ->boolean("admin")
        ->after("id")
        ->default(false);
      $table
        ->string("first_name", 255)
        ->after("admin")
        ->nullable();
      $table
        ->string("last_name", 255)
        ->after("first_name")
        ->nullable();
      $table
        ->string("display_name", 255)
        ->after("last_name")
        ->nullable();
      $table
        ->boolean("student")
        ->after("display_name")
        ->default(false);
      $table
        ->bigInteger("rpps")
        ->after("student")
        ->nullable();
      $table->timestamp("approved_at")->nullable();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table("users", function (Blueprint $table) {
      $table->string("name", 255);
      $table->timestamp("email_verified_at");

      $table->dropColumn([
        "admin",
        "first_name",
        "last_name",
        "display_name",
        "student",
        "rpps",
        "approved_at",
      ]);
    });
  }
};
