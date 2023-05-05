<?php

namespace App\Listeners;

use App\Mail\UserRegistered;
use App\Models\User;
use App\Notifications\RegisteredAdmin;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class SendUserRegisteredConfirmation
{
  /**
   * Create the event listener.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   *
   * @param  \App\Events\Registered  $event
   * @return void
   */
  public function handle(Registered $event)
  {
    Mail::to($event->user->email)->queue(new UserRegistered());
    Notification::send(new User(), new RegisteredAdmin());
  }
}
