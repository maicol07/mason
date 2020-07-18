<?php

namespace RaafiRivero\Mason\Api\Serializers;

use RaafiRivero\Mason\Answer;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Relationship;

class AnswerSerializer extends AbstractSerializer
{

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param Answer|array $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param Answer $model
     * @return string
     */
    public function getType($model)
    {
        return 'raafirivero-mason-answer';
    }

    /**
     * @param $model
     * @return Relationship
     */
    public function field($model)
    {
        return $this->hasOne(
            $model,
            FieldSerializer::class,
            'field'
        );
    }
}
