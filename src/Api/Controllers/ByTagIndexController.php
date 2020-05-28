<?php

namespace RaafiRivero\Mason\Api\Controllers;

use RaafiRivero\Mason\Api\Serializers\ByTagSerializer;
use RaafiRivero\Mason\Repositories\ByTagRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ByTagIndexController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = ByTagSerializer::class;

    public $include = [
        'all_fields',
    ];
    
    public $optionalInclude = ['fields'];

    /**
     * @var ByTagRepository
     */
    protected $bytags;

    public function __construct(ByTagRepository $bytags)
    {
        $this->bytags = $bytags;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));
        
        return $this->bytags->all();
    }
}
