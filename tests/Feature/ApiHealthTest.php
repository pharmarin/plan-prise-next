<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiHealthTest extends TestCase
{
  private $usersRoute = "/api/v1/users";
  /**
   * Test that the User JsonAPI endpoint is up.
   *
   * Expects that the API returns a 401 Unauthorized error
   *
   * @return void
   */
  public function test_the_user_endpoint_is_up()
  {
    $response = $this->get($this->usersRoute);

    $response->assertStatus(401);
  }

  public function test_the_user_endpoint_is_working()
  {
    $admin = User::whereAdmin(true)->first();

    $response = $this->actingAs($admin)->get($this->usersRoute);

    $response->assertStatus(200);
  }
}
