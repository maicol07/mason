<?php

namespace RaafiRivero\Mason\Api\Controllers;

use RaafiRivero\Mason\Api\Serializers\ByTagSerializer;
use RaafiRivero\Mason\Repositories\ByTagRepository;
use RaafiRivero\Mason\Validators\OrderValidator;
use Flarum\Api\Controller\AbstractListController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ByTagOrderController extends AbstractListController
{
    use AssertPermissionTrait;

    public $serializer = ByTagSerializer::class;

    /**
     * @var OrderValidator
     */
    protected $validator;

    /**
     * @var ByTagRepository
     */
    protected $bytags;

    public function __construct(OrderValidator $validator, ByTagRepository $bytags)
    {
        $this->validator = $validator;
        $this->bytags = $bytags;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $attributes = $request->getParsedBody();

        $this->validator->assertValid($attributes);

        $order = Arr::get($attributes, 'sort');

        $this->bytags->sorting($order);

        // Return updated sorting values
        return $this->bytags->all();
    }
}
