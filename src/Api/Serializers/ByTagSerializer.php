<?php

namespace RaafiRivero\Mason\Api\Serializers;

use RaafiRivero\Mason\ByTag;
use RaafiRivero\Mason\Repositories\FieldRepository;
use Flarum\Api\Serializer\AbstractSerializer;
use Tobscure\JsonApi\Collection;
use Tobscure\JsonApi\Relationship;

class ByTagSerializer extends AbstractSerializer
{

    /**
     * Get the default set of serialized attributes for a model.
     *
     * @param ByTag |array $model
     * @return array
     */
    protected function getDefaultAttributes($model)
    {
        return $model->toArray();
    }

    /**
     * @param ByTag $model
     * @return string
     */
    public function getType($model)
    {
        return 'raafirivero-mason-bytag';
    }
    
    /**
     * @param Field $model
     * @return Relationship
     */
    public function all_fields($model)
    {
        $actor = $this->getActor();

        if (!$actor || !$actor->isAdmin()) {
            return null;
        }

        /**
         * @var FieldRepository
         */
        $fields = app(FieldRepository::class);

        return new Relationship(new Collection($fields->all($model), app(FieldSerializer::class)));
    }

}
