<?php

namespace RaafiRivero\Mason\Api\Controllers;

use RaafiRivero\Mason\Repositories\ByTagRepository;
use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class ByTagDeleteController extends AbstractDeleteController
{
    use AssertPermissionTrait;

    /**
     * @var ByTagRepository
     */
    protected $bytags;

    public function __construct(ByTagRepository $bytags)
    {
        $this->bytags = $bytags;
    }

    protected function delete(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = Arr::get($request->getQueryParams(), 'tag_name');

        $bytag = $this->bytags->findOrFail($id);

        $this->bytags->delete($bytag);
    }
}
