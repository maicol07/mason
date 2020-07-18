<?php

namespace RaafiRivero\Mason\Api\Controllers;

use RaafiRivero\Mason\Api\Serializers\FieldSerializer;
use RaafiRivero\Mason\Repositories\FieldRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class FieldIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = FieldSerializer::class;

    public $include = [
        'all_answers',
    ];

    /**
     * @var FieldRepository
     */
    protected $fields;

    public function __construct(FieldRepository $fields)
    {
        $this->fields = $fields;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        return $this->fields->all();
    }
}
