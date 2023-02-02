<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class Registered extends Mailable
{
  /**
   * Create a new message instance.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build()
  {
    return $this->subject("Bienvenue sur plandeprise.fr !")->markdown(
      "emails.registered"
    );
  }
}
