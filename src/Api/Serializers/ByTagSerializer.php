<?php

namespace RaafiRivero\Mason\Api\Serializers;

use RaafiRivero\Mason\ByTag;
use Flarum\Api\Serializer\AbstractSerializer;
//use Tobscure\JsonApi\Relationship;

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


}
