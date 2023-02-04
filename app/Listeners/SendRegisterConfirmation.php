<?php

namespace App\Listeners;

use App\Mail\Registered as MailRegistered;
use App\Models\User;
use App\Notifications\RegisteredAdmin;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class SendRegisterConfirmation
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
    Mail::to($event->user->email)->queue(new MailRegistered());
    Notification::send(new User(), new RegisteredAdmin());
  }
}
