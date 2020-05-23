<?php

namespace RaafiRivero\Mason\Repositories;

use RaafiRivero\Mason\Field;
use RaafiRivero\Mason\ByTag;
use RaafiRivero\Mason\Validators\ByTagValidator;
use Flarum\Core\User;
use Illuminate\Cache\Repository;
use Illuminate\Support\Arr;
use Validator;

class ByTagRepository
{
    /**
     * @var ByTag
     */
    protected $bytag;

    /**
     * @var ByTagValidator
     */
    protected $validator;

    /**
     * @var Repository
     */
    protected $cache;

    public function __construct(ByTag $bytag, ByTagValidator $validator, Repository $cache)
    {
        $this->bytag = $bytag;
        $this->validator = $validator;
        $this->cache = $cache;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function query()
    {
        // this quiery from fields won't work because there's no sort column:
        // return $this->bytag->newQuery()->orderBy('sort', 'desc');
        return $this->bytag->newQuery();
    }

    /**
     * @param $id
     * @return ByTag
     */
    public function findOrFail($id)
    {
        return $this->bytag->newQuery()->findOrFail($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|ByTag[]
     */
    public function all()
    {
        return $this->query()->get();
    }

    /**
     * @param array $attributes
     * @return ByTag
     */
    public function store(array $attributes)
    {
        $this->validator->assertValid($attributes);

        $bytag = new ByTag($attributes);
        $bytag->save();

        return $bytag;
    }

    /**
     * @param ByTag $bytag
     * @param array $attributes
     * @return ByTag
     */
    public function update(ByTag $bytag, array $attributes)
    {
        $this->validator->assertValid($attributes);
        
        $bytag->fill($attributes);
        $bytag->save();

        return $bytag;
    }

    /**
     * @param ByTag $bytag
     */
    public function delete(ByTag $bytag)
    {
        $bytag->delete();
    }

    public function sorting(array $sorting)
    {
        foreach ($sorting as $i => $bytagId) {
            $this->bytag->where('id', $bytagId)->update(['sort' => $i]);
        }
    }
}
