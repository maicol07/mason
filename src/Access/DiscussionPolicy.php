<?php

namespace RaafiRivero\Mason\Access;

use Flarum\Discussion\Discussion;
use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class DiscussionPolicy extends AbstractPolicy
{
    protected $model = Discussion::class;

    public function seeRaafiRiveroMasonAnswers(User $actor, Discussion $discussion)
    {
        if ($actor->can('raafirivero.mason.see-other-fields')) {
            return true;
        }

        if ($actor->can('raafirivero.mason.see-own-fields') && $discussion->user_id == $actor->id) {
            return true;
        }

        return false;
    }

    public function fillRaafiRiveroMasonAnswers(User $actor, Discussion $discussion)
    {
        return $actor->can('raafirivero.mason.fill-fields');
    }

    public function updateRaafiRiveroMasonAnswers(User $actor, Discussion $discussion)
    {
        if ($actor->can('raafirivero.mason.update-other-fields')) {
            return true;
        }

        if ($actor->can('raafirivero.mason.update-own-fields') && $discussion->user_id == $actor->id) {
            return true;
        }

        return false;
    }
}
