<?php

namespace RaafiRivero\Mason;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $tagname
 * @property int $tagid
 * @property string $allowed_field
 * @property \Illuminate\Database\Eloquent\Collection|ByTag[] $bytags
 */
class ByTag extends AbstractModel
{
    use SoftDeletes;

    public $timestamps = true;

    protected $table = 'raafirivero_mason_bytag';

    protected $visible = [
        'tag_name',
        'tag_id',
        'allowed_field',
        'switch',
    ];


    protected $fillable = [
        'tag_name',
        'tag_id',
        'allowed_field',
        'switch',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
//    public function fields()
//    {
//        return $this->hasMany(Field::class);
//    }
}
