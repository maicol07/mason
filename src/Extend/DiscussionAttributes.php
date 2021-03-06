<?php

namespace RaafiRivero\Mason\Extend;

use RaafiRivero\Mason\Answer;
use RaafiRivero\Mason\Api\Serializers\AnswerSerializer;
use RaafiRivero\Mason\ByTag;
use RaafiRivero\Mason\Api\Serializers\ByTagSerializer;
use RaafiRivero\Mason\Handlers\DiscussionSaving;
use Flarum\Api\Controller\CreateDiscussionController;
use Flarum\Api\Controller\ListDiscussionsController;
use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Controller\UpdateDiscussionController;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Saving;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(GetModelRelationship::class, [$this, 'relationships']);
        $container['events']->listen(GetApiRelationship::class, [$this, 'serializer']);
        $container['events']->listen(WillGetData::class, [$this, 'includes']);
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
        $container['events']->listen(Saving::class, [$this, 'saving']);
    }

    public function relationships(GetModelRelationship $event)
    {
        if ($event->isRelationship(Discussion::class, 'raafiriveroMasonAnswers')) {
            return $event->model->belongsToMany(Answer::class, 'raafirivero_mason_discussion_answer', 'discussion_id', 'answer_id')
                ->withTimestamps()
                ->whereHas('field', function ($query) {
                    // Only load answers to fields that have not been deleted
                    $query->whereNull('deleted_at');
                });
        }
    }

    public function serializer(GetApiRelationship $event)
    {
        if ($event->isRelationship(DiscussionSerializer::class, 'raafiriveroMasonAnswers')) {
            return $event->serializer->hasMany($event->model, AnswerSerializer::class, 'raafiriveroMasonAnswers');
        }
    }

    public function includes(WillGetData $event)
    {
        if ($event->isController(ListDiscussionsController::class)
            || $event->isController(ShowDiscussionController::class)
            || $event->isController(CreateDiscussionController::class)
            || $event->isController(UpdateDiscussionController::class)) {
            $event->addInclude([
                'raafiriveroMasonAnswers',
                'raafiriveroMasonAnswers.field',
            ]);
        }
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $canSee = $event->actor->can('seeRaafiRiveroMasonAnswers', $event->model);

            $event->attributes['canSeeRaafiRiveroMasonAnswers'] = $canSee;
            $event->attributes['canUpdateRaafiRiveroMasonAnswers'] = $event->actor->can('updateRaafiRiveroMasonAnswers', $event->model);

            if (!$canSee) {
                // Will cause a skip of the relationship retrieval
                $event->model->setRelation('raafiriveroMasonAnswers', null);
            }
        }
    }

    public function saving(Saving $event)
    {
        /**
         * @var $saving DiscussionSaving
         */
        $saving = app(DiscussionSaving::class);
        $saving($event);
    }
}
