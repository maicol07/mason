<?php

namespace RaafiRivero\Mason\Handlers;

use RaafiRivero\Mason\Field;
use RaafiRivero\Mason\Repositories\AnswerRepository;
use RaafiRivero\Mason\Repositories\FieldRepository;
use RaafiRivero\Mason\Repositories\ByTagRepository;
use RaafiRivero\Mason\Validators\UserAnswerValidator;
use Flarum\Discussion\Event\Saving;
use Flarum\Foundation\ValidationException;
use Flarum\User\Exception\PermissionDeniedException;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;

class DiscussionSaving
{
    /**
     * @var Factory
     */
    private $validation;
    /**
     * @var FieldRepository
     */
    private $fields;
    /**
     * @var AnswerRepository
     */
    private $answers;
    /**
     * @var ByTagRepository
     */
    private $bytags;

    public function __construct(Factory $validation, FieldRepository $fields, AnswerRepository $answers, ByTagRepository $bytags)
    {
        $this->validation = $validation;
        $this->fields = $fields;
        $this->answers = $answers;
        $this->bytags = $bytags;
    }

    /**
     * @param Saving $event
     * @throws PermissionDeniedException
     * @throws \Illuminate\Validation\ValidationException
     * @throws ValidationException
     */
    public function __invoke(Saving $event)
    {
        $hasAnswersData = isset($event->data['relationships']['raafiriveroMasonAnswers']['data']);
        
        $hasTagsToValidateData = isset($event->data['relationships']['tagsToValidate']['data']);

        if ($event->discussion->exists) { // Discussion update
            // If we're updating a discussion, we only handle fields update if fields attribute is given
            // This skips cases like discussion renaming
            if ($hasAnswersData) {
                if ($event->actor->can('updateRaafiRiveroMasonAnswers', $event->discussion)) {
                    $this->fillOrUpdateFields($event);
                } else {
                    throw new PermissionDeniedException;
                }
            }
        } else { // Discussion creation
            if ($event->actor->can('fillRaafiRiveroMasonAnswers', $event->discussion)) {
                $this->fillOrUpdateFields($event);
            } else if ($hasAnswersData) {
                // Only throw a permission exception if fields data was included in the request
                // Users not authorized to use the fields should not have a raafiriveroMasonAnswers relationship at all
                throw new PermissionDeniedException;
            }
        }
    }

    /**
     * @param Saving $event
     * @throws PermissionDeniedException
     * @throws \Illuminate\Validation\ValidationException
     * @throws ValidationException
     */
    protected function fillOrUpdateFields(Saving $event)
    {
        $newAnswerIds = [];
        $answersPerField = [];
        

        $answerRelations = Arr::get($event->data, 'relationships.raafiriveroMasonAnswers.data', []);
        $currentTag =  Arr::get($event->data, 'relationships.tags.data', []);
        $tagid = $currentTag[0]['id'];

        // error_log(print_r($currentTag, true));
        // error_log(print_r($event->data, true));
        // error_log(print_r($currentTag[0]['id'], true));

        foreach ($answerRelations as $answerRelation) {
            
            $answer = null;

            if ($id = Arr::get($answerRelation, 'id')) {
                $answer = $this->answers->findOrFail($id);
            } else if (Arr::has($answerRelation, 'attributes.content') && Arr::has($answerRelation, 'relationships.field.data.id')) {
                $field = $this->fields->findOrFail(Arr::get($answerRelation, 'relationships.field.data.id'));
                $content = trim(Arr::get($answerRelation, 'attributes.content'));

                /**
                 * @var $answerValidator UserAnswerValidator
                 */
                $answerValidator = app(UserAnswerValidator::class);
                $answerValidator->setField($field);
                $answerValidator->assertValid([
                    $field->name => $content,
                ]);

                // If the field is empty, we skip the findOrCreate part
                // It will also not be counted towards the field answers count
                if ($content === null || $content === '') {
                    continue;
                }

                $answer = $this->answers->findOrCreate($field, $content);
            } else {
                throw new ValidationException([], ['raafiriveroMasonAnswers' => 'Invalid answer payload']);
            }

            if (!$event->actor->can('addToDiscussion', $answer)) {
                throw new PermissionDeniedException;
            }

            $newAnswerIds[] = $answer->id;
            $answersPerField[$answer->field->id] = Arr::get($answersPerField, $answer->field->id, 0) + 1;


        }

        $attachedFields = [];
        $fieldsBytag = [];
        // now build an array of all fields turned on attached to that Tag

        foreach ( $this->bytags->all() as $bytag ) {
            if( $bytag['tag_id'] == $tagid && $bytag['switch'] == true ) {
                // if a Tag's matching fields are enabled, add to a list
                $attachedFields[] = json_decode($bytag['allowed_field']);
            }

        }

        // form a list of full-size field objects based on this list
        foreach ($this->fields->all() as $field) { 
            if (in_array($field['name'] , $attachedFields)) {

                $fieldsBytag[] = $field;
            }
        }


        // use this list (instead of fields->all()) to validate the user responses:
        foreach ($fieldsBytag as $field) {
        //$this->fields->all()->each(function ($field) use ($event, $answersPerField) {

            // If the actor can skip fields, no need to check their number
            // if ($event->actor->can('skipField', $field)) {
            //     return;
            // }

            // if the field ID doesn't match the ids from $answersPerField, don't validate it
            $count = Arr::get($answersPerField, $field->id, 0);

            $this->validateAnswerCount($field, $count);
        }

        $event->discussion->afterSave(function ($discussion) use ($newAnswerIds) {
            $discussion->raafiriveroMasonAnswers()->sync($newAnswerIds);
        });
    }

    /**
     * @param Field $field
     * @param $count
     * @throws ValidationException
     */
    protected function validateAnswerCount(Field $field, $count)
    {
        $min = $field->min_answers_count;
        $max = $field->max_answers_count;
        $key = 'Answer Count ' . $field->name;

        $validator = $this->validation->make(
            [$key => $count],
            [$key => ['numeric', $min === $max ? "size:$min" : "between:$min,$max"]]
        );

        if ($validator->fails()) {
            throw new ValidationException([], ['raafiriveroMasonAnswers' => $validator->getMessageBag()->first($key)]);
        }
    }
}
