<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\OldUser
 *
 * @property int $Id
 * @property int $admin
 * @property string $login
 * @property string $password
 * @property string $fullname
 * @property int $active
 * @property string $mail
 * @property string $resetToken
 * @property string $reset
 * @property int $rpps
 * @property int $status
 * @property \Illuminate\Support\Carbon $inscription
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereFullname($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereInscription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereLogin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereMail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereReset($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereResetToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereRpps($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OldUser whereStatus($value)
 */
	class OldUser extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property bool $admin
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string|null $display_name
 * @property bool $student
 * @property int|null $rpps
 * @property string $email
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $active_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\OldUser|null $old_user
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereActiveAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAdmin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDisplayName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRpps($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStudent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

