<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Platform extends Model
{
    use HasFactory;

    protected $table = 'platforms';

    protected $fillable = [
        'name',
        'type',
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class)
                    ->withPivot('platform_status')
                    ->withTimestamps();
    }

}
