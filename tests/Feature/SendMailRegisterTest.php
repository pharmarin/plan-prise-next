<?php

namespace Tests\Feature;

use App\Mail\UserRegistered;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SendMailRegisterTest extends TestCase
{
  /**
   * Test the UserRegistered mail is sent.
   *
   * @return void
   */
  public function test_registered_mail_is_sent()
  {
    Mail::fake();

    $user = User::factory()->makeOne();

    event(new Registered($user));

    Mail::assertQueued(UserRegistered::class);
  }
}
