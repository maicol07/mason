<?php

namespace RaafiRivero\Mason;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $tagname
 * @property int $tagid
 * @property string $allowed_fields
 * @property \Illuminate\Database\Eloquent\Collection|ByTag[] $bytags
 */
class ByTag extends AbstractModel
{
    use SoftDeletes;

    public $timestamps = false;

    protected $table = 'raafirivero_mason_bytag';

    protected $visible = [
        'tag_name',
        'tag_id',
        'allowed_fields',
    ];

    protected $fillable = [
        'tag_name',
        'tag_id',
        'allowed_fields',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    // public function answers()
    // {
    //     return $this->hasMany(Meta::class);
    // }
}
