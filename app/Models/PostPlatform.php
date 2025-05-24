<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PostPlatform extends Pivot
{
    protected $table = 'platform_post';

    protected $casts = [
        'platform_status' => 'boolean',
    ];
}
