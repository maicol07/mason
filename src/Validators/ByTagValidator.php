<?php

namespace RaafiRivero\Mason\Validators;

use Flarum\Foundation\AbstractValidator;

class FieldValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'tag_name' => 'required|string',
            'tag_id' => 'smallinteger',
            'allowed_fields' => 'json',
        ];
    }
}
