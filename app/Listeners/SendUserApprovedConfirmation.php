<?php

namespace App\Listeners;

use App\Events\UserApproved;
use App\Mail\UserApproved as MailUserApproved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendUserApprovedConfirmation
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
   * @param  \App\Events\UserApproved  $event
   * @return void
   */
  public function handle(UserApproved $event)
  {
    Mail::to($event->user->email)->queue(new MailUserApproved());
  }
}
