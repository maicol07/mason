<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('raafirivero_mason_bytag', function (Blueprint $table) {
            $table->string('tag_name');
            $table->smallInteger('tag_id');
            $table->json('allowed_fields');
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('raafirivero_mason_bytag');
    },
];
