<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Wijourdil\NtfyNotificationChannel\Channels\NtfyChannel;
use Ntfy\Message;
use Illuminate\Notifications\Notification;

class RegisteredAdmin extends Notification
{
  use Queueable;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct()
  {
    //
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return [NtfyChannel::class];
  }

  /**
   * Get the ntfy representation of the notification.
   *
   * TODO: When iOS 17 is released use WebPush
   *
   * @param  mixed  $notifiable
   * @return Ntfy\Message
   */
  public function toNtfy(mixed $notifiable): Message
  {
    $message = new Message();
    $message->topic("plan-prise-registered");
    $message->title("Nouvelle inscription sur plandeprise.fr");
    $message->body(config("app.frontend_url") . "/admin/users");
    $message->tags(["+1"]);

    return $message;
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    return [
        //
      ];
  }
}
