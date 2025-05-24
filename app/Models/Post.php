<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'scheduled_time',
        'status'
    ];


    protected $casts = [
        'scheduled_time' => 'datetime',
    ];

    //Status constants for better code readability

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_SCHEDULED  = 'scheduled';



    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function platforms()
    {
        return $this->belongsToMany(Platform::class)
                    ->withPivot('platform_status')
                    ->withTimestamps();
    }

     //to get active platforms for this post
    public function activePlatforms()
    {
        return $this->platforms()->wherePivot('platform_status', true);
    }

}
