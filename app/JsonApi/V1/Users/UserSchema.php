<?php

namespace App\JsonApi\V1\Users;

use App\Models\User;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Boolean;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class UserSchema extends Schema
{
  /**
   * The model the schema corresponds to.
   *
   * @var string
   */
  public static string $model = User::class;

  /**
   * Get the resource fields.
   *
   * @return array
   */
  public function fields(): array
  {
    return [
      ID::make(),
      Boolean::make("active"),
      Str::make("email"),
      Str::make("firstName"),
      Str::make("lastName"),
      Str::make("name"),
      Str::make("displayName"),
      Boolean::make("admin")->readOnly(),
      Boolean::make("student"),
      Number::make("rpps"),
      DateTime::make("createdAt")
        ->hidden(static fn($request) => !$request->user()->admin)
        ->sortable(),
    ];
  }

  /**
   * Get the resource filters.
   *
   * @return array
   */
  public function filters(): array
  {
    return [
      WhereIdIn::make($this),
      Where::make("approvedAt"),
      Where::make("lastName"),
    ];
  }

  /**
   * Get the resource paginator.
   *
   * @return Paginator|null
   */
  public function pagination(): ?Paginator
  {
    return PagePagination::make();
  }
}
