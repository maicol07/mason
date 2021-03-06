<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;


return [
    'up' => function (Builder $schema) {
        $schema->create('raafirivero_mason_bytag', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tag_name');
            $table->integer('tag_id');
            $table->json('allowed_field');
            $table->boolean('switch');
            $table->timestamps();
            $table->softDeletes();
        });
    },
    'down' => function (Builder $schema) {
        $schema->drop('raafirivero_mason_bytag');
    },
];