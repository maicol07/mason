<?php

namespace RaafiRivero\Mason\Extend;

use RaafiRivero\Mason\Access\AnswerPolicy;
use RaafiRivero\Mason\Access\DiscussionPolicy;
use RaafiRivero\Mason\Access\FieldPolicy;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class Policies implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->subscribe(AnswerPolicy::class);
        $container['events']->subscribe(DiscussionPolicy::class);
        $container['events']->subscribe(FieldPolicy::class);
    }
}
