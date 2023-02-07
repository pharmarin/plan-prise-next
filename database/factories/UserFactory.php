<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
  protected $model = User::class;

  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition()
  {
    $created_at = fake()->dateTimeBetween("-5 years");
    $approved_at = fake()->dateTimeBetween($created_at);
    $updated_at = fake()->dateTimeBetween($created_at);

    $student = fake()->boolean(25);

    return [
      "first_name" => fake()->firstName(),
      "last_name" => fake()->lastName(),
      "display_name" => fake()->name(),
      "email" => fake()
        ->unique()
        ->safeEmail(),
      "student" => $student,
      "rpps" => $student
        ? null
        : fake()->numberBetween(10000000000, 19999999999),
      "created_at" => $created_at,
      "updated_at" => $updated_at,
      "approved_at" => $approved_at,
      "password" =>
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      "remember_token" => Str::random(10),
    ];
  }

  /**
   * Indicate that the model's
   * has not been verified.
   *
   * @return static
   */
  public function inactive()
  {
    return $this->state(
      fn(array $attributes) => [
        "approved_at" => null,
      ]
    );
  }
}
