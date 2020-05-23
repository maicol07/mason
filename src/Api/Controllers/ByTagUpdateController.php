<?php

namespace RaafiRivero\Mason\Api\Controllers;

use RaafiRivero\Mason\Api\Serializers\ByTagSerializer;
use RaafiRivero\Mason\Repositories\ByTagRepository;
use Flarum\Api\Controller\AbstractShowController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ByTagUpdateController extends AbstractShowController
{
    use AssertPermissionTrait;

    public $serializer = ByTagSerializer::class;

//     public $include = [
//         'all_fields',
//     ];

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

        $id = Arr::get($request->getQueryParams(), 'id');

        $bytag = $this->bytags->findOrFail($id);

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);
        
error_log('inside controller:' . print_r($attributes, true));

        return $this->bytags->update($bytag, $attributes);
    }
}
