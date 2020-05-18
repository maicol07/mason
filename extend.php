<?php

/*
 * This file is part of raafirivero/mason.
 *
 * Forked from flagrow/mason
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace RaafiRivero\Mason;

use RaafiRivero\Mason\Extend\DiscussionAttributes;
use RaafiRivero\Mason\Extend\ForumAttributes;
use RaafiRivero\Mason\Extend\Policies;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Routes('api'))
        // Fields
        ->post('/raafirivero/mason/fields/order', 'raafirivero.mason.api.fields.order', Api\Controllers\FieldOrderController::class)
        ->get('/raafirivero/mason/fields', 'raafirivero.mason.api.fields.index', Api\Controllers\FieldIndexController::class)
        ->post('/raafirivero/mason/fields', 'raafirivero.mason.api.fields.store', Api\Controllers\FieldStoreController::class)
        ->patch('/raafirivero/mason/fields/{id:[0-9]+}', 'raafirivero.mason.api.fields.update', Api\Controllers\FieldUpdateController::class)
        ->delete('/raafirivero/mason/fields/{id:[0-9]+}', 'raafirivero.mason.api.fields.delete', Api\Controllers\FieldDeleteController::class)

        // Answers
        ->post('/raafirivero/mason/fields/{id:[0-9]+}/answers/order', 'raafirivero.mason.api.answers.order', Api\Controllers\AnswerOrderController::class)
        ->post('/raafirivero/mason/fields/{id:[0-9]+}/answers', 'raafirivero.mason.api.answers.create', Api\Controllers\AnswerStoreController::class)
        ->patch('/raafirivero/mason/answers/{id:[0-9]+}', 'raafirivero.mason.api.answers.update', Api\Controllers\AnswerUpdateController::class)
        ->delete('/raafirivero/mason/answers/{id:[0-9]+}', 'raafirivero.mason.api.answers.delete', Api\Controllers\AnswerDeleteController::class),
    (new Extend\Locales(__DIR__.'/resources/locale')),
    new ForumAttributes,
    new DiscussionAttributes,
    new Policies,
];
