<?php

namespace App\JsonApi\V1\Users;

use App\Models\User;
use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class UserRequest extends ResourceRequest
{
  /**
   * Get the validation rules for the resource.
   *
   * @return array
   */
  public function rules(): array
  {
    $validation_rules = [
      "displayName" => ["string"],
      "firstName" => ["required", "string"],
      "lastName" => ["required", "string"],
      "student" => ["required", "boolean"],
    ];

    $unique = Rule::unique("users");

    if ($user = $this->model()) {
      $unique->ignore($user);
    }

    $validation_rules["email"] = ["required", "email", $unique];

    if (
      !$this->input("student") ||
      !($this->model() && $this->model()->student)
    ) {
      $validation_rules["rpps"] = [
        "required",
        "max_digits:11",
        "min_digits:11",
        "exclude_if:student,true",
      ];
    }

    return $validation_rules;
  }
}
