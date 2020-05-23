<?php

namespace RaafiRivero\Mason\Validators;

use Flarum\Foundation\AbstractValidator;

class ByTagValidator extends AbstractValidator
{
    protected function getRules()
    {
        return [
            'tag_name' => 'string',
            'tag_id' => 'integer',
            'allowed_field' => 'json',
            'switch' => 'boolean',
        ];
    }
}
