<?php

namespace RaafiRivero\Mason\Extend;

use RaafiRivero\Mason\Api\Serializers\FieldSerializer;
use RaafiRivero\Mason\Repositories\FieldRepository;
use RaafiRivero\Mason\Api\Serializers\ByTagSerializer;
use RaafiRivero\Mason\Repositories\ByTagRepository;
use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Event\WillSerializeData;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;

class ForumAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(WillSerializeData::class, [$this, 'loadRelationship']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'serializer']);
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function loadRelationship(WillSerializeData $event)
    {
        /**
         * @var $fields FieldRepository
         */
        $fields = app(FieldRepository::class);

        if ($event->isController(ShowForumController::class)) {
            // Fields need to be pre-loaded for the discussion composer, and also to be able to show empty fields on discussions
            // We first try the permissions the users are most likely to have
            if ($event->actor->can('raafirivero.mason.see-other-fields') || $event->actor->can('raafirivero.mason.fill-fields') || $event->actor->can('raafirivero.mason.see-own-fields')) {
                $event->data['raafiriveroMasonFields'] = $fields->all();
            } else {
                // Fill empty set. Without this, installs with visible notices will get "Undefined index: raafiriveroMasonFields"
                $event->data['raafiriveroMasonFields'] = [];
            }
        }
    }

    public function serializer(GetApiRelationship $event)
    {
        if ($event->isRelationship(ForumSerializer::class, 'raafiriveroMasonFields')) {
            return $event->serializer->hasMany($event->model, FieldSerializer::class, 'raafiriveroMasonFields');
        }

        if ($event->isRelationship(ByTagSerializer::class, 'raafiriveroMasonByTags')) {
            return $event->serializer->hasMany($event->model, ByTagSerializer::class, 'raafiriveroMasonByTags');
        }
    }

    public function includes(WillGetData $event)
    {
        if ($event->controller->serializer === ForumSerializer::class) {
            $event->addInclude('raafiriveroMasonFields');
            $event->addInclude('raafiriveroMasonByTags');
            $event->addInclude('raafiriveroMasonFields.suggested_answers');
        }
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            /**
             * @var $settings SettingsRepositoryInterface
             */
            $settings = app(SettingsRepositoryInterface::class);

            $canFill = $event->actor->can('raafirivero.mason.fill-fields');
            $canSeeSome = $event->actor->can('raafirivero.mason.see-other-fields') || $event->actor->can('raafirivero.mason.see-own-fields');

            if ($canFill || $canSeeSome) {
                $event->attributes['raafirivero.mason.fields-section-title'] = $settings->get('raafirivero.mason.fields-section-title', '');
                $event->attributes['raafirivero.mason.column-count'] = (int) $settings->get('raafirivero.mason.column-count', 1);
                $event->attributes['raafirivero.mason.by-tag'] = (bool) $settings->get('raafirivero.mason.by-tag', false);
            }

            if ($canFill) {
                $event->attributes['raafirivero.mason.labels-as-placeholders'] = (bool) $settings->get('raafirivero.mason.labels-as-placeholders', false);
                $event->attributes['raafirivero.mason.tags-as-fields'] = (bool) $settings->get('raafirivero.mason.tags-as-fields', false);
                $event->attributes['raafirivero.mason.tags-field-name'] = $settings->get('raafirivero.mason.tags-field-name', '');
            }

            if ($canSeeSome) {
                $event->attributes['raafirivero.mason.fields-in-hero'] = (bool) $settings->get('raafirivero.mason.fields-in-hero', false);
                $event->attributes['raafirivero.mason.hide-empty-fields-section'] = (bool) $settings->get('raafirivero.mason.hide-empty-fields-section', false);
            }

            $event->attributes['canFillRaafiRiveroMasonFields'] = $canFill;
        }
    }
}
